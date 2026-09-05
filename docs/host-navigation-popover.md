# Host navigation popover

The host shell uses one navigation source with three responsive presentations:

- **Desktop (`lg` and above):** a sticky `Host index` rail grouped into Activity, Listings, and Rental workflow.
- **Tablet (`md` through below `lg`):** the same host-navigation renderer switches to a full-width panel through the named `host-nav` inline-size container. All three groups are exposed; Activity uses two bounded columns and the other groups use one column.
- **Mobile (below `md`):** the current route stays in normal flow and `Browse sections` opens the complete route set in a native anchored popover.

## Native popover behavior

The mobile menu uses an uncontrolled native `popover="auto"` element. Its trigger uses the native invoker attributes `command="toggle-popover"` and `commandfor`, so the browser provides Escape and light-dismiss behavior without React state. The trigger declares `anchor-name: --host-menu-trigger`, and the popover uses `position-anchor: --host-menu-trigger` with `anchor(bottom)`/`anchor(right)` placement unconditionally.

The menu intentionally does not use a focus trap. It is route navigation, so it uses semantic `nav`, headings, lists, and links rather than the `menu`/`menuitem` arrow-key model. Clicking a route closes the popover by looking up its stable ID and calling the native `hidePopover()` method, then leaves normal React Router navigation and view transitions untouched. Outside clicks and Escape are handled by the native `popover="auto"` behavior.

There is deliberately no `@supports` anchor-position branch or runtime feature detection in this component. A future browser-support enhancement will polyfill CSS anchor positioning from the browser-only seam in [`app/entry.client.tsx`](../app/entry.client.tsx), separately from the existing `invokers-polyfill` import. The component therefore keeps the anchor contract simple and avoids maintaining a second placement model.

## SSR and hydration contract

The popover open state stays native and uncontrolled. The server renders the `popover="auto"` and command invoker attributes; React does not receive a controlled `open` prop. The navigation component has no render-time browser access, effect, open state, or element refs. Its ID-based close helper runs only from a client click handler; the native invoker owns opening, toggling, Escape, and light dismissal.

## Navigation data contract

There are seven route records across three groups. `Vans` and `Add Van` intentionally share `/host/vans`: `Vans` is the canonical current-route summary, while `Add Van` remains a distinct command in the grouped menu. The data contract marks `Vans` as eligible for current-page styling and `Add Van` as `currentBehavior: "never"`, which renders `aria-current="false"`. This keeps the commands separate without introducing a query parameter, alias, or merged item.
