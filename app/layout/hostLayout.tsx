import { href, NavLink, Outlet } from "react-router";
import type { Route } from "./+types/hostLayout";
import { getSessionOrRedirect } from "~/lib/auth/getSessionOrRedirect";

export const loader = async ({ request }: Route.ClientLoaderArgs) => {
  await getSessionOrRedirect(request);
};

export default function HostLayout() {
  return (
    <div>
      <ul className="flex gap-3">
        <li>
          <NavLink
            to={href("/host")}
            end
            className={({ isActive, isPending }) =>
              isPending ? "text-green-500" : isActive ? "underline" : ""
            }
            viewTransition
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to={href("/host/income")}
            className={({ isActive, isPending }) =>
              isPending ? "text-green-500" : isActive ? "underline" : ""
            }
            viewTransition
          >
            Income
          </NavLink>
        </li>
        <li>
          <NavLink
            to={href("/host/vans")}
            end
            className={({ isActive, isPending }) =>
              isPending ? "text-green-500" : isActive ? "underline" : ""
            }
            viewTransition
          >
            Vans
          </NavLink>
        </li>
        <li>
          <NavLink
            to={href("/host/review")}
            className={({ isActive, isPending }) =>
              isPending ? "text-green-500" : isActive ? "underline" : ""
            }
            viewTransition
          >
            Reviews
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
