import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import AdminApp from "./AdminApp";
import { ToastProvider } from "./ui";

createRoot(document.getElementById("admin-root")!).render(
  <StrictMode>
    <ToastProvider>
      <AdminApp />
    </ToastProvider>
  </StrictMode>
);
