import { NavLink, Outlet } from "react-router";

export default function HostLayout() {
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
