import { useEffect, useState, type AnchorHTMLAttributes } from "react";

export function usePathname(): string {
  const [pathname, setPathname] = useState(() => window.location.pathname.replace(/\/+$/, "") || "/");

  useEffect(() => {
    const update = () => setPathname(window.location.pathname.replace(/\/+$/, "") || "/");
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  return pathname;
}

export function navigate(to: string): void {
  if (window.location.pathname === to) return;
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" });
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, ...rest }: LinkProps) {
  return (
    <a
      {...rest}
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
          return;
        }
        event.preventDefault();
        navigate(to);
      }}
    />
  );
}
