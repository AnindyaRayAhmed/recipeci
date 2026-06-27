type CompletionBannerProps = {
  visible: boolean;
};

export function CompletionBanner({ visible }: CompletionBannerProps) {
  if (!visible) return null;

  return (
    <aside aria-label="completion banner" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
      <strong className="block text-lg">Great job.</strong> ChopChop says your cooking workflow is complete.
    </aside>
  );
}
