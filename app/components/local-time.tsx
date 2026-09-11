import { type ComponentProps, Suspense, use } from "react";
import { browser } from "react-dom";
import type { Prettify } from "~/types";

const LOCAL_DATE_FORMAT = {
  day: "numeric",
  month: "short",
  weekday: "short",
  year: "numeric",
} as const satisfies Intl.DateTimeFormatOptions;

const localDateFormatter = new Intl.DateTimeFormat(
  undefined,
  LOCAL_DATE_FORMAT
);

const utcDateFormatter = new Intl.DateTimeFormat("en-US", {
  ...LOCAL_DATE_FORMAT,
  timeZone: "UTC",
});

type LocalTimeProps = Prettify<
  Omit<ComponentProps<"time">, "children" | "dateTime"> & {
    date: Date;
  }
>;

const BrowserLocalTime = ({ date, ...rest }: LocalTimeProps) => {
  use(browser("viewer-local calendar date"));

  return (
    <time {...rest} dateTime={date.toISOString()}>
      {localDateFormatter.format(date)}
    </time>
  );
};

const LocalTime = ({ date, ...rest }: LocalTimeProps) => (
  <Suspense
    fallback={
      <time {...rest} dateTime={date.toISOString()}>
        {utcDateFormatter.format(date)}
      </time>
    }
  >
    <BrowserLocalTime date={date} {...rest} />
  </Suspense>
);

export { LocalTime };
