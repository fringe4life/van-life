import type { Route } from "./+types/index";

const HOST_VAN_DETAIL_ROUTE_ID = "routes/host/vans/index" satisfies NonNullable<
  Route.ComponentProps["matches"][number]
>["id"];

type HostVanDetailLoaderData = Route.ComponentProps["loaderData"];

function isHostVanDetailLoaderData(
  loaderData: unknown
): loaderData is HostVanDetailLoaderData {
  return (
    typeof loaderData === "object" &&
    loaderData !== null &&
    "van" in loaderData &&
    typeof loaderData.van === "object" &&
    loaderData.van !== null
  );
}

function getHostVanDetailLoaderData(
  matches: ReadonlyArray<{ id: string; loaderData?: unknown } | undefined>
): HostVanDetailLoaderData {
  const match = matches.find(
    (candidate) => candidate?.id === HOST_VAN_DETAIL_ROUTE_ID
  );

  if (!(match && isHostVanDetailLoaderData(match.loaderData))) {
    const ids = matches
      .map((candidate) => candidate?.id)
      .filter((id): id is string => typeof id === "string");

    throw new Error(
      `Host van detail loader data is missing for "${HOST_VAN_DETAIL_ROUTE_ID}". Matches: ${ids.join(", ")}`
    );
  }

  return match.loaderData;
}

export { getHostVanDetailLoaderData };
