import { describe, expect, it } from "vitest";
import { advanceCookingTaskStatuses, areAllTasksDone } from "../src/utils/cookingWorkflow";

describe("cooking workflow helpers", () => {
  it("advances a task through the workflow", () => {
    const tasks = [
      { title: "Prep", durationMinutes: 10, status: "Pending" as const, note: "" },
    ];

    const once = advanceCookingTaskStatuses(tasks, "Prep");
    const twice = advanceCookingTaskStatuses(once, "Prep");
    const thrice = advanceCookingTaskStatuses(twice, "Prep");

    expect(once[0].status).toBe("In Progress");
    expect(twice[0].status).toBe("Done");
    expect(thrice[0].status).toBe("Done");
  });

  it("detects completion only when tasks are done", () => {
    expect(areAllTasksDone([])).toBe(false);
    expect(
      areAllTasksDone([
        { title: "Prep", durationMinutes: 10, status: "Done" as const, note: "" },
        { title: "Cook", durationMinutes: 20, status: "Done" as const, note: "" },
      ]),
    ).toBe(true);
  });
});
