import { NotificationRepository } from '../repositories/notification.repository';

export class NotificationService {
  private repo = new NotificationRepository();

  getRecent(userId: string, limit = 20) {
    return this.repo.getRecent(userId, limit);
  }

  getUnreadCount(userId: string) {
    return this.repo.getUnreadCount(userId);
  }

  markAllRead(userId: string) {
    return this.repo.markAllRead(userId);
  }

  send(
    targetUserId: string,
    type: string,
    message: string,
    relatedId?: string | null
  ) {
    return this.repo.send(targetUserId, type, message, relatedId);
  }
}
