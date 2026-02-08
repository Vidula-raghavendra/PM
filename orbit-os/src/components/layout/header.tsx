export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10"></div>
            </div>
        </header>
    );
}
