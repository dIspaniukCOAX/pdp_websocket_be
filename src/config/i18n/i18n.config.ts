import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';

export const i18nConfig = () => {
  return {
    fallbackLanguage: 'uk',
    formatter: (template: string) => template,
    loaderOptions: {
      path: join(__dirname, '../../i18n/'),
      watch: true,
    },
  };
};

export const i18nResolvers = [
  new QueryResolver(['lang', 'l']),
  new HeaderResolver(['x-custom-lang']),
  new CookieResolver(),
  AcceptLanguageResolver,
];
