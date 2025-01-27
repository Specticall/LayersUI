import { ctxTest } from "../App";
import { useDialogContext } from "./ui/Dialog";

export default function DialogTest() {
  const { content } = useDialogContext<ctxTest>();
  return <div>{content}</div>;
}
