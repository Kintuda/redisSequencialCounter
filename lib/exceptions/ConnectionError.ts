import { BaseException } from "./BaseException";

export type StoreType = "REDIS" | "MEMORY";

export class ConnectionError extends BaseException {
  public store: StoreType;
  public advise: string;

  constructor(message: string, store: StoreType) {
    super(message);
    this.store = store;
    this.advise =
      "Before using the redis store, you should estabilish a connection first";
  }

  public generateAdvise(): string {
    switch (this.store) {
      case "MEMORY":
        return "Before using the store, you should instantiate a store";
      case "REDIS":
        return "Before using the redis store, you should estabilish a connection first";
    }
  }

  public formatMessage(): string {
    switch (this.store) {
      case "REDIS":
        return "Redis store is unachivable, maybe connection is down";
      case "MEMORY":
        return "Memory store is unavailable";
    }
  }
}
