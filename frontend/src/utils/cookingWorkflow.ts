import type { CookingTask, CookingTaskStatus } from "../types/plan";

const taskOrder: CookingTaskStatus[] = ["Pending", "In Progress", "Done"];

export function advanceCookingTaskStatuses(tasks: CookingTask[], taskTitle: string): CookingTask[] {
  return tasks.map((task) => {
    if (task.title !== taskTitle) return task;
    const currentIndex = taskOrder.indexOf(task.status);
    const nextIndex = Math.min(currentIndex + 1, taskOrder.length - 1);
    return { ...task, status: taskOrder[nextIndex] };
  });
}

export function areAllTasksDone(tasks: CookingTask[]): boolean {
  return tasks.length > 0 && tasks.every((task) => task.status === "Done");
}
