import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ContractsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border rounded-lg border-dashed">
                <FileText className="h-10 w-10 mb-4 opacity-20" />
                <h3 className="text-lg font-semibold">No contracts yet</h3>
                <p>Upload and manage your client agreements here.</p>
            </div>
        </div>
    );
}
