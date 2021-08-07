import { ConnectionStates, RedisStore } from "../../lib";
import { ConnectionError } from "../../lib/exceptions/ConnectionError";

describe("RedisStore", () => {
  it("should transition between states, according to the connection status", async () => {
    const store = new RedisStore();
    expect(store.state === ConnectionStates.DISCONNECTED);
    await store.connect();
    expect(store.state === ConnectionStates.CONNECTED);
    await store.disconnect();
    expect(store.state === ConnectionStates.DISCONNECTED);
  });

  it("increment should never fall into a infinity loop", async () => {
    const store = new RedisStore();
    await store.connect();

    try {
      await store.increment("foobar", -1);
    } catch (error) {
      expect(error.message).toEqual("Reached the max number of retries");
    }

    try {
      await store.increment("foobar", 0);
    } catch (error) {
      expect(error.message).toEqual("Reached the max number of retries");
    }
  });

  it("should not try run a command if connection is not yet estabilished", async () => {
    const store = new RedisStore();

    try {
      await store.increment("foobar", 10);
    } catch (error) {
      expect(error.message).toEqual("Connection not yet estabilished");
    }
  });
});
