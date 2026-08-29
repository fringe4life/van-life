/**
 * Empty-list copy for the pagination toolbar.
 *
 * This is not typical cursor-pagination empty-window UI: a successful empty
 * connection (no cursor) can show this, but empty-after-cursor should still
 * offer Previous or back-to-start, not collapse into “no items.” Follow-up.
 * @see docs/cursor-pagination-limit-and-component-split.md
 */
export const PaginationUnsuccessful = () => (
  <p className="pr-1 text-right text-muted-foreground text-sm italic">
    No items found
  </p>
);
