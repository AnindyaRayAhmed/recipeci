import type { CookingTask } from "../types/plan";

type TaskCardProps = {
  task: CookingTask;
  onClick: () => void;
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <button
      type="button"
      aria-label={`Move task ${task.title} to the next stage`}
      onClick={onClick}
      className="rounded-xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-medium text-neutral-900">{task.title}</h4>
          <p className="mt-1 text-sm text-neutral-600">{task.note}</p>
        </div>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">{task.durationMinutes} min</span>
      </div>
      <div className="mt-3 text-sm text-neutral-700">Status: {task.status}</div>
    </button>
  );
}
