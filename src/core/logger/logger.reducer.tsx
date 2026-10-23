import React from 'react';
import uuid from 'react-native-uuid';
import { LoggerActionType } from './logger.actions';
import { ILoggerLine, ILoggerReducerAction } from './logger.interface';

const MAX_LOG_LINES = 200;

export const LoggerReducer:React.Reducer<ILoggerLine[], ILoggerReducerAction> = (
  prevState: ILoggerLine[],
  action: ILoggerReducerAction,
) => {
  switch (action.type) {
    case LoggerActionType.LOG:
      return [
        ...prevState,
        {
          ...action.value,
          id: uuid.v4().toString(),
          ts: new Date(),
        } as ILoggerLine,
      ].slice(-MAX_LOG_LINES);
    case LoggerActionType.RESET:
      return [];
    default:
  }
  return prevState;
};
