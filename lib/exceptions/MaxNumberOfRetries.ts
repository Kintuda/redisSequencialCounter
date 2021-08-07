import { BaseException } from "./BaseException";

export class MaxNumberOfRetriesAchieved extends BaseException {
  public adivise: string;

  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this);
    this.adivise =
      "Maybe the key is being changed at a rapid pace, and the watch command is retrying to obtain lock, maybe increasing the maxAttempt parameters could resolve this";
  }

  public formatMessage(): string {
    return "The increment reached the maxium number";
  }
}
