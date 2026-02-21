import { requireUser } from "@/auth/guard";
import { GoalsClient } from "@/components/goals/goals-client";
import { GoalService } from "@/services/goal.service";

export default async function GoalsPage() {
    const userId = await requireUser();

    const goals = await GoalService.getGoals(userId);

    return (
        <GoalsClient goals={goals} />
    );
}
