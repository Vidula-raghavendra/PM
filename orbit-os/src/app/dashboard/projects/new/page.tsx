import { ProjectFormV2 } from "@/components/projects/project-form-v2";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewProjectPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/projects">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
                    <p className="text-muted-foreground">Detailed setup for high-value projects.</p>
                </div>
            </div>

            <ProjectFormV2 />
        </div>
    );
}
