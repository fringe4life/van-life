import { href, Link, NavLink, Outlet } from "react-router";
import { auth } from "~/lib/auth/auth";
import { authClient } from "~/lib/auth/client";
import type { Route } from "./+types/layout";

export const loader = async ({ request }: Route.ClientLoaderArgs) => {
  const result = await auth.api.getSession({ headers: request.headers });
  console.log({ result });
};

export default async function Layout({}: Route.ComponentProps) {
  const session = await authClient.getSession();
  const hasToken = session?.data?.session?.token !== null;
  console.log({ session: session?.data?.session?.token });
  return (
    <>
      <header className="flex justify-between px-4 py-9 items-center">
        <h1 className="uppercase font-black text-2xl">
          <Link to={href("/")} viewTransition>
            #vanlife
          </Link>
        </h1>
        <nav>
          <ul className="flex gap-3">
            <li>
              <NavLink
                to={href("/about")}
                className={({ isActive, isPending }) =>
                  isPending ? "text-green-500" : isActive ? "underline" : ""
                }
                viewTransition
              >
                About
              </NavLink>
            </li>
            {hasToken ? (
              <li>
                <NavLink
                  to={href("/host")}
                  className={({ isActive, isPending }) =>
                    isPending ? "text-green-500" : isActive ? "underline" : ""
                  }
                  viewTransition
                >
                  Host
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink
                  to={href("/vans")}
                  className={({ isActive, isPending }) =>
                    isPending ? "text-green-500" : isActive ? "underline" : ""
                  }
                  viewTransition
                >
                  Vans
                </NavLink>
              </li>
            )}
            {hasToken ? (
              <li>
                <NavLink
                  to={href("/login")}
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
                <Link to={href("/signout")}>Sign out</Link>
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
