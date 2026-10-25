import { LoggerActionType } from './logger.actions';

export interface ILoggerLine {
    id: string;
    ts: Date;
    message: string;
}

export interface ILoggerReducerAction {
    type: LoggerActionType;
    value?: Partial<ILoggerLine>;
    messages?: string[];
}
