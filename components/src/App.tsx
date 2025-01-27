import DashboardLayout from "./components/DashboardLayout";
import { useDialog } from "./components/Dialog";
import { dialogComponents } from "./main";

export type ctxTest = { content: string };

export default function App() {
  const dialog = useDialog<typeof dialogComponents>();

  return (
    <div>
      <button
        onClick={() => {
          dialog.open("test", {
            content: "I was testing",
          } satisfies ctxTest);
        }}
      >
        OPEN DIALOG
      </button>
    </div>
  );
}
