const ENTRIES = [
  {
    term: "Arts collected",
    body: "Pieces bought in paid marketplace sales that month. Gifts and free transfers are not counted.",
  },
  {
    term: "Sales",
    body: "Paid purchases that month. One sale can include more than one piece.",
  },
  {
    term: "Collectors",
    body: "Unique wallets that bought art that month. Monthly uniques are not added across months.",
  },
  {
    term: "Year collectors",
    body: "Wallets that bought at least once in that year (union of monthly sets). Do not add monthly uniques together.",
  },
  {
    term: "YTD",
    body: "January through the last closed month versus the same months last year. Collectors in the window are unique wallets, not a sum of months.",
  },
  {
    term: "Sellers",
    body: "Unique wallets that sold art that month. Also monthly, not summed.",
  },
  {
    term: "XTZ",
    body: "Tezos paid for those sales in the month.",
  },
  {
    term: "USD",
    body: "That month’s XTZ total converted with a mid-month Tezos price.",
  },
  {
    term: "Averages",
    body: "Pieces per collector and USD per collector, for that period only.",
  },
  {
    term: "Net new minters",
    body: "Coming next. First-time minters whose wallet was also new around that mint.",
  },
] as const;

export function MethodsPage() {
  return (
    <article className="mx-auto max-w-2xl">
      <header className="mb-8">
        <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">Notes</p>
        <h2 className="mt-2 font-display text-4xl tracking-tight text-fg">Methods</h2>
        <p className="mt-3 text-sm text-muted">
          Closed-month counts of marketplace art collected on Tezos.
        </p>
      </header>
      <dl className="flex flex-col divide-y divide-border">
        {ENTRIES.map((entry) => (
          <div key={entry.term} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-8">
            <dt className="font-medium text-fg">{entry.term}</dt>
            <dd className="text-sm leading-relaxed text-muted">{entry.body}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-sm leading-relaxed text-muted">
        Sources: objkt.com public index and TzKT prices. Not Tezos Foundation.
      </p>
    </article>
  );
}
