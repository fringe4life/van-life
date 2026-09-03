import { css } from "../../../../../styled-system/css";
import { useVanDetailCard } from "./context";

/**
 * Details sub-component - displays van name, category, and description
 */
function Details() {
  const van = useVanDetailCard();
  const { name, type, description } = van;

  return (
    <article>
      <p className={css({ fontWeight: "bold" })}>
        Name:
        <span className={css({ fontWeight: "normal" })}>{name}</span>
      </p>

      <p className={css({ fontWeight: "bold", marginBlock: "4" })}>
        Category:
        <span
          className={css({
            fontWeight: "normal",
            textTransform: "capitalize",
          })}
        >
          {type}
        </span>
      </p>

      <p
        className={css({
          fontWeight: "bold",
          maxInlineSize: "3xs", // 16rem
          minInlineSize: "full",
        })}
      >
        Description:
        <span className={css({ fontWeight: "normal" })}>{description}</span>
      </p>
    </article>
  );
}

export { Details };
