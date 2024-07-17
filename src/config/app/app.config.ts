export const appConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    chat: process.env.POSTGRES_chat,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
});
