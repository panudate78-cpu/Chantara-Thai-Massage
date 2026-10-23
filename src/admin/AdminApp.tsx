import { useEffect, useState } from "react";
import Login from "./Login";
import AdminLayout from "./Layout";
import { api, setUnauthorisedHandler, type SessionInfo } from "./lib/api";
import { usePathname } from "./lib/router";
import { PageLoader } from "./ui";
import Dashboard from "./pages/Dashboard";
import Business from "./pages/Business";
import Homepage from "./pages/Homepage";
import Treatments from "./pages/Treatments";
import Offers from "./pages/Offers";
import Gallery from "./pages/Gallery";
import SeoProtection from "./pages/SeoProtection";
import Account from "./pages/Account";

function Splash() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f6f2e9]">
      <PageLoader label="Opening your content manager…" />
    </div>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "anon" | "ready">("loading");
  const [expired, setExpired] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    setUnauthorisedHandler(() => {
      setSession(null);
      setExpired(true);
      setStatus("anon");
    });

    api
      .session()
      .then((info) => {
        if (!active) return;
        setSession(info);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("anon");
      });

    return () => {
      active = false;
      setUnauthorisedHandler(null);
    };
  }, []);

  const signOut = async () => {
    try {
      await api.logout();
    } catch {
      /* the cookie is cleared locally either way */
    }
    setSession(null);
    setExpired(false);
    setStatus("anon");
    if (window.location.pathname !== "/admin") {
      window.history.replaceState({}, "", "/admin");
    }
  };

  if (status === "loading") return <Splash />;

  if (status === "anon" || !session) {
    return (
      <Login
        notice={expired ? "Your session ended for security. Please sign in again." : undefined}
        onSuccess={(info) => {
          setSession(info);
          setExpired(false);
          setStatus("ready");
        }}
      />
    );
  }

  const page = (() => {
    switch (pathname) {
      case "/admin":
        return <Dashboard />;
      case "/admin/business":
        return <Business />;
      case "/admin/homepage":
        return <Homepage />;
      case "/admin/treatments":
        return <Treatments />;
      case "/admin/offers":
        return <Offers />;
      case "/admin/gallery":
        return <Gallery />;
      case "/admin/seo":
        return <SeoProtection />;
      case "/admin/account":
        return <Account onSignOut={signOut} />;
      default:
        return <Dashboard />;
    }
  })();

  return (
    <AdminLayout
      businessName={session.site.name}
      siteUrl={session.site.url}
      userEmail={session.user.email}
      onSignOut={signOut}
    >
      {page}
    </AdminLayout>
  );
}
