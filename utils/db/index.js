const { Pool } = require("pg");
const redisC = require("redis");
const { promisify } = require("util");

const {
  database: { postgres, redis },
} = require("../../config");

const pool = new Pool({
  host: postgres.host,
  port: postgres.port,
  database: postgres.database,
  user: postgres.username,
  password: postgres.password,
});

const client = redisC.createClient({
  host: redis.host,
  port: redis.port,
  password: redis.password,
});

promisify(client.get).bind(client);
promisify(client.set).bind(client);
promisify(client.del).bind(client);

module.exports = {
  pool,
  redis: client,
};
