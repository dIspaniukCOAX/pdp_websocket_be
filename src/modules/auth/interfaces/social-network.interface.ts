export interface SocialProfileData {
  id?: string;
  email?: string;
  fullName?: string;
}

export interface SocialNetworkUserDataStrategyInterface {
  getData(
    token: string,
    params?: Record<string, string>,
  ): Promise<SocialProfileData>;
}
