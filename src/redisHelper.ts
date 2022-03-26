const Redis = require("ioredis");
const config = require('config');

export class RedisHelper {
    private static instance: RedisHelper
    private readonly redisClient: any

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {

        this.redisClient = new Redis(config.get("REDIS_PORT"), config.get("REDIS_HOST"))
        this.redisClient.on('error', (err: any) => console.log('Redis Client Error', err));

    }

    async connect(): Promise<any> {
        await this.redisClient.connect()
    }

    async setData(value: any): Promise<any> {
        await this.redisClient.set("token", value)
    }


    async getData(): Promise<any> {
        return await this.redisClient.get("token")
    }


    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): RedisHelper {
        if (!RedisHelper.instance) {
            RedisHelper.instance = new RedisHelper();
        }

        return RedisHelper.instance;
    }

    public getRedisClient() {
        return this.redisClient
    }

}