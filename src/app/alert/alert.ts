import { v4 as uuid } from 'uuid';

export enum AlertColor {
  Red,
  Green,
  Yellow
}

export class Alert {
  readonly id = uuid();
  constructor(
    public readonly message: string,
    public readonly color: AlertColor,
    public readonly autoDismiss: boolean = true
  ) { }
}
