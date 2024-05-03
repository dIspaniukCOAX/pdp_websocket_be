export const REGEXP = {
  password: /^(?=.*\d)(?!.*\s)(?=.*[a-zA-Z])/,
  link: /^(https?:\/\/)?(maps\.app\.goo\.gl|www\.google\.com)\/.+$/,
  date: new RegExp('^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$', 'i'),
} as const;
