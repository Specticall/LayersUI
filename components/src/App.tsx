import Button from "./components/ui/Button";
import { useDialog } from "./components/ui/Dialog";
import { dialogComponents } from "./main";

export type ctxTest = { content: string };

export default function App() {
  const dialog = useDialog<typeof dialogComponents>();

  return (
    <div>
      <Button
        onClick={() => {
          dialog.open("test", {
            content: "I was testing",
          } satisfies ctxTest);
        }}
      >
        OPEN DIALOG
      </Button>
    </div>
  );
}
