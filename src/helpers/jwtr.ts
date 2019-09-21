import { default as JWTR } from 'jwt-redis';
import * as redis from 'redis';
const redisClient: any = redis.createClient();
export const jwtr: any = new JWTR(redisClient);
