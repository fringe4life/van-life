import {
  createContext,
  data,
  href,
  redirect,
  useNavigation,
} from "react-router";
import { CustomForm } from "~/components/custom-form";
import { FormError } from "~/components/form/form-error";
import { getNavigationFormStatus } from "~/components/form/get-fetcher-status";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { useAutoIdleStatus } from "~/components/form/use-auto-idle-status";
import { StatusButton } from "~/components/status-button";
import { UnsuccesfulState } from "~/components/unsuccesful-state";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { parseUuidV7 } from "~/dal/parse-uuidv7.server";
import {
  completeReturnRental,
  type HostRentedVan,
  loadReturnRentalContext,
} from "~/features/host/services/rental.server";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { getHostRedirectUrl } from "~/features/middleware/utils/auth-redirect";
import { CustomLink } from "~/features/navigation/components/custom-link";
import { VanCard } from "~/features/vans/components/van-card";
import { getCost } from "~/features/vans/utils/get-cost";
import {
  domainErrorToServiceResult,
  isDomainError,
  throwDomainHttp,
} from "~/utils/errors/domain-error.server";
import { getRouteErrorMessage } from "~/utils/errors/get-route-error-message";
import { notFound } from "~/utils/errors/not-found";
import { toActionResultOrThrow } from "~/utils/errors/to-action-result.server";
import type { Route } from "./+types/return-rental";

interface SharedRentalData {
  money: number;
  rent: HostRentedVan;
}

const sharedRentalDataContext = createContext<SharedRentalData>();

const fetchSharedDataMiddleware: Route.MiddlewareFunction = async (
  { params, context },
  next
) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  let rentId: ReturnType<typeof parseUuidV7>;
  try {
    rentId = parseUuidV7(params.rentId, "Invalid rental id");
  } catch (error) {
    throwDomainHttp(error);
  }

  const { rent, money } = await loadReturnRentalContext(db, rentId, user.id);

  if (!rent) {
    notFound("Rented van not found");
  }

  if (typeof money !== "number") {
    notFound("Account summary not found");
  }

  context.set(sharedRentalDataContext, { money, rent });

  return next();
};

export const middleware: Route.MiddlewareFunction[] = [
  fetchSharedDataMiddleware,
];

export const headers = forwardDataHeaders;

export const loader = ({ context }: Route.LoaderArgs) => {
  const rentalData = context.get(sharedRentalDataContext);

  return data(
    {
      ...rentalData,
    },
    { headers: PRIVATE_NO_STORE_HEADERS }
  );
};

export const action = async ({ params, context }: Route.ActionArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);
  const { rent, money } = context.get(sharedRentalDataContext);

  let rentId: ReturnType<typeof parseUuidV7>;
  try {
    rentId = parseUuidV7(params.rentId, "Invalid rental id");
  } catch (error) {
    if (isDomainError(error)) {
      const actionFailure = toActionResultOrThrow(
        domainErrorToServiceResult(error)
      );
      if (actionFailure) {
        return actionFailure;
      }
    }
    throw error;
  }

  const result = await completeReturnRental(db, {
    money,
    rent,
    rentId,
    userId: user.id,
  });

  const actionFailure = toActionResultOrThrow(result);
  if (actionFailure) {
    return actionFailure;
  }

  throw redirect(href("/host"));
};

const ReturnRental = ({
  loaderData,
  actionData,
  params,
}: Route.ComponentProps) => {
  const { rent, money } = loaderData;
  const navigation = useNavigation();
  const isFormNavigation = Boolean(navigation.formMethod);
  const status = useAutoIdleStatus(
    getNavigationFormStatus(navigation.state, actionData, {
      isFormNavigation,
    })
  );

  const { formError } = readActionFormData(actionData);

  const amountToPay = getCost(rent.rentedAt, new Date(), rent.van);
  const isUnableToPay = money < amountToPay;
  return (
    <section className="flex flex-col gap-4">
      <title>Return {rent.van.name} | Vanlife</title>
      <meta
        content="The van you might return to it's owner"
        name="description"
      />
      <h2>Return this van:</h2>
      <div className="max-w-lg">
        <VanCard
          action={<p />}
          link={href("/host/rentals/returnRental/:rentId", {
            rentId: params.rentId,
          })}
          van={rent.van}
        />
      </div>
      {!!isUnableToPay && (
        <article>
          <p className="text-lg text-red-400">
            You cannot afford to return this van.
          </p>
          <CustomLink
            to={getHostRedirectUrl(
              href("/host/rentals/returnRental/:rentId", {
                rentId: params.rentId,
              })
            )}
          >
            Top up your account <span className="underline">here</span>
          </CustomLink>
        </article>
      )}
      <CustomForm method="POST">
        <StatusButton disabled={isUnableToPay} status={status} type="submit">
          Return
        </StatusButton>
        <FormError message={formError} />
      </CustomForm>
    </section>
  );
};
export default ReturnRental;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <UnsuccesfulState isError message={getRouteErrorMessage(error)} />
);
