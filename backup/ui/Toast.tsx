import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "../../utils/lib";
import { createPortal } from "react-dom";

type ToastContextValues = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValues | null>(null);

type ToastState = {
  message: string;
  // Used to differentiate calls from `toast()`. Without this, a call from `toast()` with the same message won't trigger the timeout effect.
  id: number;
  show: boolean;
  type: "success" | "error";
};

/*
 * ToastProvider is a context provider that provides a function to display a Toast message.
 * The Toast message is displayed at the bottom of the screen and disappears after a specified amount of time.
 * The message can be displayed using the `toast.success(msg)` or `toast.error(msg)` function.
 *
 * Self implementation of the popular library `react-toastify` to display Toast messages.
 */
export default function ToastProvider({
  children,
  suspendDuration = 2000,
}: {
  children: ReactNode;
  suspendDuration?: number;
}) {
  const [state, setState] = useState<ToastState>({
    id: 0,
    message: "Default message",
    show: false,
    type: "success",
  });

  // Suspends / display the Toast for a specified amount of time.
  useEffect(() => {
    const suspend = setTimeout(() => {
      setState((cur) => ({ ...cur, show: false }));
    }, suspendDuration);

    return () => {
      clearTimeout(suspend);
    };
  }, [suspendDuration, state.message, state.id]);

  /**
   * Displays the Toast window with the message inside.
   */
  const toast = useMemo(() => {
    return {
      success: (message: string) =>
        setState({ id: Math.random(), message, show: true, type: "success" }),
      error: (message: string) =>
        setState({ id: Math.random(), message, show: true, type: "error" }),
    };
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {createPortal(
        <div
          className={cn(
            "fixed bottom-4 right-6 z-[100] translate-y-[-2rem] text-slate-900 bg-bg text-start flex justify-between items-center pl-5 pr-4 py-2 rounded-md shadow-lg shadow-main/30 transition-all duration-500 w-fit border-slate-300 border whitespace-nowrap gap-4 bg-white",
            state.type === "error" && "bg-red-500 border-red-400 text-white"
          )}
          style={{
            translate: state.show ? "0 0" : "0 300%",
          }}
        >
          {state.message}
        </div>,
        document.body
      )}

      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error("useToast can't be used outside of its provider's scope");
  return context;
}
