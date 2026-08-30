"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
} from "@/app/actions/notifications";
import { respondToInvitation } from "@/app/actions/collaborators";
import type { Notification } from "@/lib/mappers";

function timeAgo(date: Date | null): string {
    if (!date) return "";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function NotificationPopover() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Fetch count on mount and periodically
    useEffect(() => {
        getUnreadNotificationCount().then(setUnreadCount).catch(() => {});
        const interval = setInterval(() => {
            getUnreadNotificationCount().then(setUnreadCount).catch(() => {});
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Fetch full list when popover opens
    useEffect(() => {
        if (open) {
            getNotifications().then(setNotifications).catch(() => {});
        }
    }, [open]);

    const handleMarkAllRead = () => {
        startTransition(async () => {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        });
    };

    const handleRespond = (collaboratorId: string, response: "ACCEPTED" | "DECLINED", notifId: string) => {
        startTransition(async () => {
            await respondToInvitation(collaboratorId, response);
            await markNotificationRead(notifId);
            setNotifications(prev => prev.map(n =>
                n.id === notifId ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="relative hover:text-accent-ink transition-colors">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h4 className="text-sm font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7"
                            onClick={handleMarkAllRead}
                            disabled={isPending}
                        >
                            <CheckCheck className="h-3 w-3 mr-1" /> Mark all read
                        </Button>
                    )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">No notifications yet.</p>
                    )}
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`px-4 py-3 border-b last:border-0 ${!n.isRead ? "bg-primary/5" : ""}`}
                        >
                            <div className="flex items-start gap-2">
                                <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${!n.isRead ? "bg-primary" : "bg-transparent"}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium leading-tight">{n.title}</p>
                                    {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                                    <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>

                                    {/* Invitation actions */}
                                    {n.type === "INVITATION" && !n.isRead && n.metadata?.collaborator_id && (
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                size="sm"
                                                className="h-7 text-xs"
                                                disabled={isPending}
                                                onClick={() => handleRespond(n.metadata.collaborator_id, "ACCEPTED", n.id)}
                                            >
                                                <Check className="h-3 w-3 mr-1" /> Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 text-xs"
                                                disabled={isPending}
                                                onClick={() => handleRespond(n.metadata.collaborator_id, "DECLINED", n.id)}
                                            >
                                                Decline
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
