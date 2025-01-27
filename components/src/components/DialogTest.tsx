import { ctxTest } from "../App";
import { useDialogContext } from "./Dialog";

export default function DialogTest() {
  const { content } = useDialogContext<ctxTest>();
  return <div>{content}</div>;
}
