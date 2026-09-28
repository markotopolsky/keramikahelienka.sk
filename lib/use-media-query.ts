import { useCallback, useSyncExternalStore } from "react";

/**
 * Tracks a CSS media query, e.g. `useMediaQuery("(min-width: 64rem)", true)`.
 * The server has no viewport, so it renders with `serverValue` and the client
 * switches to the real match right after hydration.
 */
export function useMediaQuery(query: string, serverValue: boolean) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
