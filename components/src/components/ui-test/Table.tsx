import { forwardRef, HTMLAttributes, PropsWithChildren, Ref } from "react";
import { cn } from "@/utils/lib";

/**
 * @example
 * <Table.Container className="min-w-[50rem] rounded-md overflow-hidden">
    <Table.Head sticky>
      <Table.Row className="bg-white">
        <Table.Cell>Invoice</Table.Cell>
        <Table.Cell>Payment Status</Table.Cell>
        <Table.Cell>Total Amount</Table.Cell>
        <Table.Cell>Payment Method</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {invoices.map((data, i) => {
        return (
          <Table.Row className="bg-white" key={i}>
            <Table.Cell>{data.invoice}</Table.Cell>
            <Table.Cell>{data.paymentStatus}</Table.Cell>
            <Table.Cell>{data.totalAmount}</Table.Cell>
            <Table.Cell>{data.paymentMethod}</Table.Cell>
          </Table.Row>
        );
      })}
    </Table.Body>
  </Table.Container>
 * @returns 
 */
function Container(
  { children, ...props }: PropsWithChildren & HTMLAttributes<HTMLTableElement>,
  ref: Ref<HTMLTableElement>
) {
  return (
    <table {...props} ref={ref} className={cn("w-full", props.className)}>
      {children}
    </table>
  );
}

function Head(
  {
    children,
    ...props
  }: PropsWithChildren<{ sticky?: boolean }> &
    HTMLAttributes<HTMLTableSectionElement>,
  ref: Ref<HTMLTableSectionElement>
) {
  return (
    <thead
      {...props}
      ref={ref}
      className={cn(
        props.sticky && "sticky top-0 right-0 left-0",
        props.className
      )}
    >
      {children}
    </thead>
  );
}

function Body(
  {
    children,
    ...props
  }: PropsWithChildren & HTMLAttributes<HTMLTableSectionElement>,
  ref: Ref<HTMLTableSectionElement>
) {
  return (
    <tbody {...props} ref={ref}>
      {children}
    </tbody>
  );
}

function Row(
  {
    children,
    ...props
  }: PropsWithChildren<{ padding?: { x?: number; y?: number } }> &
    HTMLAttributes<HTMLTableRowElement>,
  ref: Ref<HTMLTableRowElement>
) {
  return (
    <tr {...props} ref={ref}>
      {children}
    </tr>
  );
}

function Cell(
  {
    children,
    ...props
  }: PropsWithChildren & HTMLAttributes<HTMLTableCellElement>,
  ref: Ref<HTMLTableCellElement>
) {
  return (
    <td className="px-4 py-2 text-start" ref={ref} {...props}>
      {children}
    </td>
  );
}

export default {
  Container: forwardRef(Container),
  Body: forwardRef(Body),
  Head: forwardRef(Head),
  Row: forwardRef(Row),
  Cell: forwardRef(Cell),
};
