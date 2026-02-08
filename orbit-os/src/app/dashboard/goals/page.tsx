import { Target } from "lucide-react";

export default function GoalsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border rounded-lg border-dashed">
                <Target className="h-10 w-10 mb-4 opacity-20" />
                <h3 className="text-lg font-semibold">Track your objectives</h3>
                <p>Set quarterly and annual goals for your business.</p>
            </div>
        </div>
    );
}
