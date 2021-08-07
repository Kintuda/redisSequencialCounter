import { BaseStore, ConnectionStates } from "./abstract";
import IORedis, { Redis, RedisOptions } from "ioredis";
import { MaxNumberOfRetriesAchieved } from "./exceptions/MaxNumberOfRetries";
import { ConnectionError } from "./exceptions/ConnectionError";

export class RedisStore extends BaseStore<Redis> {
  private static instance: RedisStore;
  private connection?: Redis;
  public state: ConnectionStates = ConnectionStates.DISCONNECTED;

  /**
   * @description retrieves the singleton instance
   * @returns
   */
  public static getInstance(): RedisStore {
    if (!RedisStore.instance) {
      RedisStore.instance = new RedisStore();
    }

    return RedisStore.instance;
  }

  /**
   * @description connects to a database if connection was not made
   * @param options
   * @returns
   */
  public async connect(options: RedisOptions = {}): Promise<Redis> {
    if (!this.connection) {
      const connection = new IORedis();
      await new Promise((resolve) => connection.on("connect", resolve));
      this.connection = connection;
      this.state = ConnectionStates.CONNECTED;
    }

    return this.connection;
  }

  /**
   * @description increment a key
   * @param key key to increment
   * @param retries max number of retries
   * @returns
   */
  public async increment(key: string, retries = 1): Promise<boolean> {
    if (!this.connection)
      throw new ConnectionError("Connection not yet estabilished", "REDIS");

    if (retries <= 0) {
      throw new MaxNumberOfRetriesAchieved("Reached the max number of retries");
    }

    await this.watch(key);
    const result = await this.connection.multi().incr(key).get(key).exec();

    if (result === null) {
      return this.increment(key, retries - 1);
    }

    return true;
  }

  /**
   * @description watch a key
   * @param key
   * @returns
   */
  public async watch(key: string): Promise<boolean> {
    if (!this.connection)
      throw new ConnectionError("Connection not yet estabilished", "REDIS");

    await this.connection.watch(key);
    return true;
  }

  /**
   * @description check if connection is up
   * @returns boolean
   */
  public isLive(): boolean {
    return this.state === ConnectionStates.CONNECTED;
  }

  public async disconnect(): Promise<boolean> {
    if (this.connection) {
      await this.connection.quit();
      this.state = ConnectionStates.DISCONNECTED;
    }

    return true;
  }
}
