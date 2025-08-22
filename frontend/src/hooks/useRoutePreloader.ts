import { useCallback } from "react";

export const useRoutePreloader = () => {
  const preloadRoute = useCallback((routePath: string) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = routePath;
    document.head.appendChild(link);
  }, []);

  const preloadOnHover = useCallback(
    (routePath: string) => {
      preloadRoute(routePath);
    },
    [preloadRoute]
  );

  return { preloadRoute, preloadOnHover };
};
