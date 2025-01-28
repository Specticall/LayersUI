import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "react-loading-skeleton/dist/skeleton.css";
import { DialogComponents, DialogProvider } from "./components/ui/Dialog.tsx";
import DialogTest from "./components/DialogTest.tsx";

export const dialogComponents = [
  {
    name: "test",
    component: <DialogTest />,
  },
  {
    name: "another",
    component: <div></div>,
  },
] as const satisfies DialogComponents;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <ToastProvider> */}
    <DialogProvider components={dialogComponents}>
      <App />
    </DialogProvider>
    {/* </ToastProvider> */}
  </StrictMode>
);
