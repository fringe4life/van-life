import { href, Link, NavLink, Outlet } from "react-router";
import { authClient } from "~/lib/auth/client";

export default function Layout() {
  const { data: session } = authClient.useSession();
  console.log(session?.session);
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
            {!session?.session ? (
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
