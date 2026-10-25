import React from 'react';
// @ts-ignore
import redeyed from 'redeyed';
import colors from 'ansi-colors';

const cleanAnsi = (str: string) => str
  .replace(/\s\u2713/g, '')
  .replace(/\s\u2715/g, '');

const applyWithBold = (color: colors.StyleFunction):
  ((s:string) => string) => (txt: string): string => colors.bold(color(txt));

export const useStyledCode = (code: string, isDark: boolean = false) => {
  const cleanCode = React.useMemo<string>(() => cleanAnsi(code), [code]);

  const styledCode = React.useMemo<string>(() => {
    try {
      const parsed = redeyed(cleanCode, {
        String: {
          _default: (s: any, info: any) => {
            const nextToken = info.tokens[info.tokenIndex + 1];

            // show keys of object literals and json in different color
            return nextToken
              && nextToken.type === 'Punctuator'
              && nextToken.value === ':'
              ? colors.green(s)
              : applyWithBold(colors.magenta)(s);
          },
        },
        Boolean: {
          true: () => applyWithBold(colors.green)('true \u2713'),
          false: () => applyWithBold(colors.red)('false \u2715'),
        },
        Numeric: {
          _default: applyWithBold(colors.magenta),
        },
        Null: {
          _default: applyWithBold(colors.red),
        },
        Punctuator: {
          '{': isDark ? colors.whiteBright : colors.blackBright,
          '}': isDark ? colors.whiteBright : colors.blackBright,
          '(': isDark ? colors.whiteBright : colors.blackBright,
          ')': isDark ? colors.whiteBright : colors.blackBright,
          '[': isDark ? colors.whiteBright : colors.blackBright,
          ']': isDark ? colors.whiteBright : colors.blackBright,
          ',': colors.green,
          _default: isDark ? colors.whiteBright : colors.blackBright,
        },
      });
      return parsed.code;
    // eslint-disable-next-line no-empty
    } catch {}
    return code;
  }, [cleanCode, isDark]);

  return {
    cleanCode,
    styledCode,
  };
};
