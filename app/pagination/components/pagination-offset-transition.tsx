import {
  addTransitionType,
  startTransition,
  useLayoutEffect,
  useState,
  ViewTransition,
} from "react";
import { viewTransition } from "styled-system/css";
import {
  PaginationPageEpochContext,
  PaginationPagerClearContext,
  PaginationPendingDirectionContext,
  PaginationSliceLockContext,
  usePaginationPagerClear,
  usePaginationPendingDirection,
} from "~/pagination/components/pagination-page-epoch";
import type { Direction } from "~/pagination/types";
import { takePageSliceMove } from "~/pagination/utils/page-slice-key";
import type { Children } from "~/types";

const slideStart = {
  base: "calc(-100vw - 60px)",
  md: "-60px",
} as const;

const slideEnd = {
  base: "calc(100vw + 60px)",
  md: "60px",
} as const;

const enterLeft = viewTransition({
  new: {
    "--slide-distance": slideStart,
    animationDuration: "slow",
    animationName: "fade-in, slide-in",
  },
});

const enterRight = viewTransition({
  new: {
    "--slide-distance": slideEnd,
    animationDuration: "slow",
    animationName: "fade-in, slide-in",
  },
});

const exitLeft = viewTransition({
  old: {
    "--slide-distance": slideStart,
    animationDuration: "slow",
    animationName: "fade-out, slide-out",
  },
});

const exitRight = viewTransition({
  old: {
    "--slide-distance": slideEnd,
    animationDuration: "slow",
    animationName: "fade-out, slide-out",
  },
});

type PaginationPageSliceProps = Children & {
  sliceKey: string;
};

/**
 * Page-slice enter/exit. Key is a click epoch, not URL cursor, so filter/search
 * cursor resets do not remount this boundary (nested cards can enter/exit).
 *
 * Epoch bumps when the rendered slice identity changes after a pager click, not
 * on the click itself. Click remounts run before loader data; that later commit is
 * a new Transition with types reset, so nested card default enter/exit would
 * fire. Same-commit remount keeps cards inside the parent mount (no inner enter).
 */
const PaginationPageSlice = ({
  children,
  sliceKey,
}: PaginationPageSliceProps) => {
  const pendingDirection = usePaginationPendingDirection();
  const clearPagerIntent = usePaginationPagerClear();
  const [pageEpoch, setPageEpoch] = useState(0);
  const [prevSliceKey, setPrevSliceKey] = useState<string | null>(null);
  const [needsPagerClear, setNeedsPagerClear] = useState(false);

  const { direction, isFirstPaint } = takePageSliceMove(
    sliceKey,
    prevSliceKey,
    pendingDirection
  );

  if (sliceKey !== prevSliceKey) {
    setPrevSliceKey(sliceKey);
    if (direction) {
      startTransition(() => {
        addTransitionType(direction);
      });
      setNeedsPagerClear(true);
      if (!isFirstPaint) {
        setPageEpoch((epoch) => epoch + 1);
      }
    }
  }

  useLayoutEffect(() => {
    if (!needsPagerClear) {
      return;
    }
    setNeedsPagerClear(false);
    clearPagerIntent?.();
  }, [clearPagerIntent, needsPagerClear]);

  return (
    <ViewTransition
      default="none"
      enter={{
        backward: enterLeft,
        default: "none",
        forward: enterRight,
      }}
      exit={{
        backward: exitRight,
        default: "none",
        forward: exitLeft,
      }}
      key={`pagination-page-${pageEpoch}`}
    >
      {children}
    </ViewTransition>
  );
};

/**
 * Pager click context plus optional keyed slice. PaginationControl must be a
 * descendant so prev/next can stash a direction for the next slice commit.
 */
const PaginationOffsetTransition = ({
  children,
  sliceKey,
}: Children & {
  sliceKey?: string;
}) => {
  const [pendingDirection, setPendingDirection] = useState<Direction | null>(
    null
  );

  const bumpPageEpoch = (direction: Direction) => {
    setPendingDirection(direction);
  };

  const clearPagerIntent = () => {
    setPendingDirection(null);
  };

  return (
    <PaginationSliceLockContext value={pendingDirection !== null}>
      <PaginationPendingDirectionContext value={pendingDirection}>
        <PaginationPagerClearContext value={clearPagerIntent}>
          <PaginationPageEpochContext value={bumpPageEpoch}>
            {sliceKey === undefined ? (
              children
            ) : (
              <PaginationPageSlice sliceKey={sliceKey}>
                {children}
              </PaginationPageSlice>
            )}
          </PaginationPageEpochContext>
        </PaginationPagerClearContext>
      </PaginationPendingDirectionContext>
    </PaginationSliceLockContext>
  );
};

export { PaginationOffsetTransition, PaginationPageSlice };
