import type { CookingTask } from "../types/plan";
import { TaskCard } from "./TaskCard";

type CookingKanbanProps = {
  tasks: CookingTask[];
  onAdvance: (taskTitle: string) => void;
};

export function CookingKanban({ tasks, onAdvance }: CookingKanbanProps) {
  const columns = ["Pending", "In Progress", "Done"] as const;

  return (
    <section aria-label="cooking kanban" className="grid gap-4 lg:grid-cols-3">
      {columns.map((column) => (
        <div key={column} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700">{column}</h3>
          <div className="grid gap-3">
            {tasks.filter((task) => task.status === column).map((task) => (
              <TaskCard key={task.title} task={task} onClick={() => onAdvance(task.title)} />
            ))}
            {!tasks.some((task) => task.status === column) ? (
              <p className="rounded-xl border border-dashed border-neutral-300 bg-white px-3 py-4 text-sm text-neutral-500">
                No tasks here yet.
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
}
