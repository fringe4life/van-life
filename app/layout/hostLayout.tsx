import { NavLink, Outlet, redirect } from "react-router";
import { auth } from "~/lib/auth/auth";
import type { Route } from "./+types/hostLayout";

export const loader = async ({ request }: Route.ClientLoaderArgs) => {
  const result = await auth.api.getSession({ headers: request.headers });
  if (!result?.session) {
    throw redirect("/login");
  }
};

export default async function HostLayout() {
  return (
    <div>
      <ul className="flex gap-3">
        <li>
          <NavLink
            to="/host"
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
            to="/host/income"
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
            to="/host/vans"
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
            to="/host/reviews"
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
