import { data, href, useLocation } from "react-router";
import { OutcomeState } from "~/components/outcome-state";
import { HTTP_STATUS } from "~/constants/http-constants";

const NOT_FOUND_DESCRIPTION =
  "We couldn’t find this page. The address may be incorrect, or the page may have moved.";

export const loader = () => data(null, { status: HTTP_STATUS.NOT_FOUND });

const NotFound = () => {
  const { pathname } = useLocation();

  return (
    <OutcomeState
      description={NOT_FOUND_DESCRIPTION}
      headingLevel="h1"
      kind="empty"
      metadata={
        <span>
          <strong>Path:</strong>{" "}
          <bdi dir="auto">{pathname || "unavailable"}</bdi>
        </span>
      }
      primaryAction={{ label: "Return to dashboard", to: href("/host") }}
      secondaryAction={{ label: "View your vans", to: href("/host/vans") }}
      title="Page not found"
    />
  );
};

export default NotFound;
