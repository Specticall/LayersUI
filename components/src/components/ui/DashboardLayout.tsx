import Table from "./Table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-200">
      <div className="min-h-screen grid grid-cols-[12.5rem_1fr]">
        <aside className="bg-white">
          <p>Sidebar</p>
        </aside>
        <main className="relative">
          <header className="py-4 bg-white px-4">Top Bar</header>
          <section className="overflow-auto absolute inset-0 px-4 mt-14 flex flex-col">
            <h1 className="mb-4 font-semibold text-2xl mt-4">Dashboard</h1>
            <div className="mb-6 grid grid-cols-3 gap-4 w-full min-w-[50rem]">
              <div className="px-4 py-4 rounded-md bg-white text-xl">120</div>
              <div className="px-4 py-4 rounded-md bg-white text-xl">120</div>
              <div className="px-4 py-4 rounded-md bg-white text-xl">120</div>
            </div>
            <div className="bg-white rounded-md flex-1 min-w-[50rem]">
              <Table.Container>
                <Table.Head sticky>
                  <Table.Row>
                    <Table.Cell>Invoice</Table.Cell>
                    <Table.Cell>Payment Status</Table.Cell>
                    <Table.Cell>Total Amount</Table.Cell>
                    <Table.Cell>Payment Method</Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {invoices.map((data, i) => {
                    return (
                      <Table.Row key={i}>
                        <Table.Cell>{data.invoice}</Table.Cell>
                        <Table.Cell>{data.paymentStatus}</Table.Cell>
                        <Table.Cell>{data.totalAmount}</Table.Cell>
                        <Table.Cell>{data.paymentMethod}</Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Container>{" "}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
