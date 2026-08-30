import { ProjectFormV2 } from "@/components/projects/project-form-v2";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewProjectPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto px-8 py-12 animate-page-rise">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/projects" aria-label="Back to projects">
                        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                </Button>
                <div>
                    <p className="eyebrow text-muted-foreground mb-1">Projects</p>
                    <h1 className="text-display-sm">New Project</h1>
                </div>
            </div>

            <ProjectFormV2 />
        </div>
    );
}
