import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { RedisOptions } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const options = {
  host: process.env.REDIS_HOST as string,
  port: parseInt(process.env.REDIS_PORT as string),
};

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

export default pubsub;
