import React from 'react';
import { LoggerReducer } from './logger.reducer';
import { ILoggerLine, ILoggerReducerAction } from './logger.interface';
import { LoggerActionType } from '.';

const initialState: ILoggerLine[] = [];

type LoggerContextProps = {
  loggerState: ILoggerLine[];
  log: (message: string) => void;
  loggerDispatcher: React.Dispatch<ILoggerReducerAction>;
};

// @ts-ignore
export const LoggerContext:React.Context<LoggerContextProps> = React.createContext();

export const LoggerContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loggerState, loggerDispatcher] = React.useReducer(LoggerReducer, initialState);

  const log = React.useCallback((message: string) => loggerDispatcher({
    type: LoggerActionType.LOG,
    value: { message },
  }), []);

  return (
    <LoggerContext.Provider value={
      React.useMemo<LoggerContextProps>(() => ({
        loggerState,
        log,
        loggerDispatcher,
      }), [loggerState, loggerDispatcher])
      }
    >
      {children}
    </LoggerContext.Provider>
  );
};
