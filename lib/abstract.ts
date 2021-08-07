export enum ConnectionStates {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  CONNECTION_FAILED = "CONNECTION_FAILED",
}

export abstract class BaseStore<T> {
  public state: ConnectionStates = ConnectionStates.DISCONNECTED;
  abstract connect(): Promise<T>;
  abstract watch(id: string): Promise<boolean>;
  abstract disconnect(): Promise<boolean>;
  abstract increment(key: string, retries: number): Promise<boolean>;
}
