import { Link, NavLink, Outlet } from "react-router";
import { auth } from "~/lib/auth/auth";
import type { Route } from "./+types/layout";
import { authClient } from "~/lib/auth/client";

export const loader = async ({ request }: Route.LoaderArgs) => {
  // const session = await auth.api.getSession({
  //   headers: request.headers, // you need to pass the headers object.
  // });
  // return { session };
};

export default function Layout({}: Route.ComponentProps) {
  const { data: session } = authClient.useSession();
  console.log(session);
  return (
    <>
      <header className="flex justify-between px-4 py-9 items-center">
        <h1 className="uppercase font-black text-2xl">
          <Link to="/" viewTransition>
            #vanlife
          </Link>
        </h1>
        <nav>
          <ul className="flex gap-3">
            <li>
              <NavLink
                to="/about"
                className={({ isActive, isPending }) =>
                  isPending ? "text-green-500" : isActive ? "underline" : ""
                }
                viewTransition
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/vans"
                className={({ isActive, isPending }) =>
                  isPending ? "text-green-500" : isActive ? "underline" : ""
                }
                viewTransition
              >
                Vans
              </NavLink>
            </li>
            {!session?.session.token ? (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive, isPending }) =>
                    isPending ? "text-green-500" : isActive ? "underline" : ""
                  }
                  viewTransition
                >
                  Login
                </NavLink>
              </li>
            ) : (
              <li>
                <Link to="/signout">Sign out</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main className="grid grid-rows-subgrid">
        <Outlet />
      </main>
      <footer className="bg-neutral-800">
        <p className="uppercase text-sm text-center py-6.25 text-[#aaa]">
          &copy;{new Date().getFullYear()} #vanlife
        </p>
      </footer>
    </>
  );
}
// Icon by <a href='https://iconpacks.net/?utm_source=link-attribution&utm_content=13335'>Iconpacks</a>

// Icon by <a href='https://iconpacks.net/?utm_source=link-attribution&utm_content=13375'>Iconpacks</a>

// Icon by <a href='https://iconpacks.net/?utm_source=link-attribution&utm_content=16709'>Iconpacks</a>

// <a target="_blank" href="https://www.vexels.com/png-svg/preview/199192/rv-trailer-illustration">www.vexels.com</a>
