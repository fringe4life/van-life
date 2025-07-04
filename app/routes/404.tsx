import { href, Link } from "react-router";
import { buttonVariants } from "~/components/ui/button";

export default function NotFound() {
  return (
    <section className="place-self-center">
      <h2 className="text-[#161616] font-bold text-3xl ">
        Sorry, the page you were looking for was not found.
      </h2>
      <Link to={href("/")} className={buttonVariants({ variant: "secondary" })}>
        Return to home
      </Link>
    </section>
  );
}
