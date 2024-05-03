import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Auth, google } from 'googleapis';
import { I18nContext, I18nService } from 'nestjs-i18n';

import {
  SocialNetworkUserDataStrategyInterface,
  SocialProfileData,
} from '../interfaces/social-network.interface';

@Injectable()
export class GoogleStrategy implements SocialNetworkUserDataStrategyInterface {
  public readonly oauthClient: Auth.OAuth2Client;

  constructor(private readonly i18n: I18nService) {
    this.oauthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.APP_CLIENT_URL,
    );
  }

  async getData(token: string): Promise<SocialProfileData> {
    try {
      const userInfoClient = google.oauth2('v2').userinfo;

      const { tokens } = await this.oauthClient.getToken(token);

      this.oauthClient.setCredentials(tokens);

      const { data: userData } = await userInfoClient.get({
        auth: this.oauthClient,
      });

      return {
        id: userData?.id,
        email: userData?.email?.toLowerCase(),
        fullName: `${userData?.given_name} ${userData?.family_name}`,
      };
    } catch (error) {
      throw new HttpException(
        this.i18n.t('errors.invalidAuthorizationCode', {
          lang: I18nContext?.current()?.lang,
        }),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
