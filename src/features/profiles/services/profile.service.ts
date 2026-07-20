import { ProfileRepository } from '../repositories/profile.repository';
import { Profile } from '@/types';

const profileRepo = new ProfileRepository();

export class ProfileService {
  async getProfile(userId: string): Promise<Profile | null> {
    return profileRepo.getProfile(userId);
  }

  async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    // Here we can add business logic (e.g. validating timezone strings or checking premium limits)
    return profileRepo.updateProfile(userId, data);
  }
}
