import { EEmailTypes } from '../modules/email/enums/email-types.enum';

export const EmailTemplateIds: {
  [k in EEmailTypes]?: number;
} = {
  [EEmailTypes.FORGOT_PASSWORD_EMAIL]: 5797983,
  [EEmailTypes.PASSWORD_CHANGED_EMAIL]: 5797996,
  [EEmailTypes.NEW_LOGIN]: 5797979,
  [EEmailTypes.REGISTERED]: 5791038,
};
