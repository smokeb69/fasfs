export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/bloomcrawler',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || 'your-client-id',
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || 'your-client-secret',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  ownerOpenId: process.env.OWNER_OPEN_ID || ''
};
