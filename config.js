module.exports = {
  server: {
    port: process.env.SERVER_PORT,
    corsConfig: {
      origin: "*",
      credentials: true,
    },
  },
  database: {
    postgres: {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_DATABASE,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
  },
  secrets: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  },

  AWS: {
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
  mailServer: {
    from: process.env.MAIL_FROM,
    replyTo: process.env.MAIL_REPLY_TO,
  },
};
