import { Outlet } from "react-router";
import { grid } from "styled-system/patterns";

const AuthLayout = () => (
  <div
    className={grid({
      blockSize: "full",
      gap: { base: "4", md: "12", sm: "6" },
      placeContent: "center",
    })}
  >
    <meta content="noindex, nofollow" name="robots" />
    <Outlet />
  </div>
);
export default AuthLayout;
