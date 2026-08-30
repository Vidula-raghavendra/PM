import { Card } from "@/components/ui/card";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Palette } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="mx-auto max-w-[1200px] animate-page-rise space-y-6 px-5 py-6 sm:px-8 sm:py-8">
            <div>
                <p className="eyebrow mb-2 text-accent-ink">Settings</p>
                <h2 className="font-display text-[32px] font-medium italic leading-[1.15] tracking-[-0.01em]">Account</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                            <LogOut className="h-4 w-4 text-destructive" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold tracking-tight mb-1">Sign out</h3>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">
                                End your current session and return to the sign-in page.
                            </p>
                        </div>
                    </div>
                    <form action={logout}>
                        <Button variant="destructive" size="sm" className="rounded-full">
                            Sign Out
                        </Button>
                    </form>
                </Card>

                <Card className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/70">
                            <Palette className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold tracking-tight mb-1">Appearance</h3>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">
                                Customize the look and feel of your workspace.
                            </p>
                        </div>
                    </div>
                    <p className="text-[13px] text-muted-foreground">
                        Theme selection will be available in the next update.
                    </p>
                </Card>
            </div>
        </div>
    );
}
