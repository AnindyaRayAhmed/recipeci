export function LandingHero() {
  return (
    <header className="grid gap-4 rounded-3xl border border-amber-100 bg-amber-50 p-6 shadow-sm md:p-8" aria-label="ReciPeci introduction">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <img
          src="/recipeci-logo.svg"
          alt="ReciPeci logo"
          width={72}
          height={72}
          className="h-14 w-14 shrink-0 sm:h-16 sm:w-16"
        />
        <div className="grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">ReciPeci</p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Plan meals with ChopChop.
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-neutral-700 md:text-base">
            Generate a realistic meal plan, review groceries, and step through cooking in a calm workflow.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href="#planning-form"
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
        >
          Start planning
        </a>
        <span className="text-sm text-neutral-600">Powered by ChopChop</span>
      </div>
    </header>
  );
}
