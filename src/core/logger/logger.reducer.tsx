import React from 'react';
import uuid from 'react-native-uuid';
import { LoggerActionType } from './logger.actions';
import { ILoggerLine, ILoggerReducerAction } from './logger.interface';

const MAX_LOG_LINES = 200;

const toLine = (message: string, ts: Date): ILoggerLine => ({
  message,
  id: uuid.v4().toString(),
  ts,
});

export const LoggerReducer:React.Reducer<ILoggerLine[], ILoggerReducerAction> = (
  prevState: ILoggerLine[],
  action: ILoggerReducerAction,
) => {
  switch (action.type) {
    case LoggerActionType.LOG:
      return [
        ...prevState,
        toLine(action.value?.message || '', new Date()),
      ].slice(-MAX_LOG_LINES);
    case LoggerActionType.LOG_MANY: {
      if (!action.messages?.length) {
        return prevState;
      }
      const ts = new Date();
      return [
        ...prevState,
        ...action.messages.map((message) => toLine(message, ts)),
      ].slice(-MAX_LOG_LINES);
    }
    case LoggerActionType.RESET:
      return [];
    default:
  }
  return prevState;
};
