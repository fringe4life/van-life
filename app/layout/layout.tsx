import { Link, NavLink, Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <header className="flex justify-between px-4 py-9 items-center">
        <h1 className="uppercase font-black text-2xl">
          <Link to="/">#vanlife</Link>
        </h1>
        <nav>
          <ul className="flex gap-3">
            <li>
              <NavLink
                to="/about"
                className={({ isActive, isPending }) =>
                  isPending ? "text-green-500" : isActive ? "underline" : ""
                }
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
              >
                Vans
              </NavLink>
            </li>
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
