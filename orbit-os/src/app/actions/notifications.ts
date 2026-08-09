"use server";

import { requireUser } from "@/auth/guard";
import { NotificationService } from "@/services/notification.service";
import type { Notification } from "@/lib/mappers";

export async function getNotifications(): Promise<Notification[]> {
    const userId = await requireUser();
    return NotificationService.getForUser(userId);
}

export async function getUnreadNotificationCount(): Promise<number> {
    const userId = await requireUser();
    return NotificationService.getUnreadCount(userId);
}

export async function markNotificationRead(notificationId: string) {
    await requireUser();
    await NotificationService.markAsRead(notificationId);
    return { success: true };
}

export async function markAllNotificationsRead() {
    const userId = await requireUser();
    await NotificationService.markAllAsRead(userId);
    return { success: true };
}
