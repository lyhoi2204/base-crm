export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_CONNECTION_PATH,
  },
  jwt: {
    secret: process.env.JWT_SECRET || '123456',
    signOptions: {
      expiresIn: process.env.JTW_TTL || '24h',
    },
  },
});
