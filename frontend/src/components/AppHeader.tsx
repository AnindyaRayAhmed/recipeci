export function AppHeader() {
  return (
    <header className="flex flex-col gap-3 rounded-3xl border border-amber-100 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <img
          src="/recipeci-logo.svg"
          alt="ReciPeci logo"
          width={40}
          height={40}
          className="h-10 w-10 shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-none text-neutral-900">ReciPeci</p>
          <p className="mt-1 text-xs text-neutral-600">AI meal planning and cooking workflow</p>
        </div>
      </div>
      <p className="text-xs font-medium text-neutral-600">
        Powered by <span className="text-neutral-900">ChopChop</span>
      </p>
    </header>
  );
}
