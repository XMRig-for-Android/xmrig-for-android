import React from 'react';
import { LoggerReducer } from './logger.reducer';
import { ILoggerLine, ILoggerReducerAction } from './logger.interface';
import { LoggerActionType } from './logger.actions';

const initialState: ILoggerLine[] = [];

type LoggerActionsProps = {
  log: (message: string) => void;
  logMany: (messages: string[]) => void;
  loggerDispatcher: React.Dispatch<ILoggerReducerAction>;
};

type LoggerContextProps = LoggerActionsProps & {
  loggerState: ILoggerLine[];
};

// @ts-ignore
export const LoggerContext:React.Context<LoggerContextProps> = React.createContext();

// Stable across log updates, so producers don't re-render on every new line.
// @ts-ignore
export const LoggerActionsContext:React.Context<LoggerActionsProps> = React.createContext();

export const LoggerContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loggerState, loggerDispatcher] = React.useReducer(LoggerReducer, initialState);

  const actions = React.useMemo<LoggerActionsProps>(() => ({
    log: (message: string) => loggerDispatcher({
      type: LoggerActionType.LOG,
      value: { message },
    }),
    logMany: (messages: string[]) => loggerDispatcher({
      type: LoggerActionType.LOG_MANY,
      messages,
    }),
    loggerDispatcher,
  }), []);

  const value = React.useMemo<LoggerContextProps>(
    () => ({ ...actions, loggerState }),
    [actions, loggerState],
  );

  return (
    <LoggerActionsContext.Provider value={actions}>
      <LoggerContext.Provider value={value}>
        {children}
      </LoggerContext.Provider>
    </LoggerActionsContext.Provider>
  );
};
