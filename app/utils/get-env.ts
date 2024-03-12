/* eslint-disable @typescript-eslint/no-explicit-any */

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
}

export const getEnv = (): any => {
  if(isBrowser()) {
    return (<any>window).ENV;
  } else {
    return process.env;
  }
}
