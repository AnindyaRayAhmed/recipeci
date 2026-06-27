type ChatWindowProps = {
  message: string;
};

export function ChatWindow({ message }: ChatWindowProps) {
  return (
    <section aria-label="chat with chopchop" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-900">ChopChop</h3>
      <p className="mt-2 text-sm text-neutral-700">{message}</p>
    </section>
  );
}
