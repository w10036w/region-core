import { region } from './region';

const { private_setConfig } = region;

describe('config', () => {
  test('default', () => {
    const { name, enableLog, expiredTime, strictLoading, silentConnect, private_actionTypes, DefaultLoading, DefaultError } = region;
    expect(name).toBe(null);
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(true);
    expect(strictLoading).toBe(true);
    expect(silentConnect).toBe(undefined);
    expect(DefaultLoading).toBe(undefined);
    expect(DefaultError).toBe(undefined);
    expect(private_actionTypes).toEqual({
      LOAD: '@region/LOAD',
      SET: '@region/SET',
    });
  });
  test('set nothing', () => {
    private_setConfig();
    const { name, enableLog, expiredTime, strictLoading, silentConnect, private_actionTypes, DefaultLoading, DefaultError } = region;
    expect(name).toBe(null);
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(true);
    expect(strictLoading).toBe(true);
    expect(silentConnect).toBe(undefined);
    expect(DefaultLoading).toBe(undefined);
    expect(DefaultError).toBe(undefined);
    expect(private_actionTypes).toEqual({
      LOAD: '@region/LOAD',
      SET: '@region/SET',
    });
  });
  test('set enableLog as false', () => {
    private_setConfig({ enableLog: false });
    const { name, enableLog, expiredTime, DefaultLoading, DefaultError } = region;
    expect(name).toBe(null);
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(false);
    expect(DefaultLoading).toBe(undefined);
    expect(DefaultError).toBe(undefined);
  });
  test('set config', () => {
    private_setConfig({
      enableLog: false,
      expiredTime: 30000,
      name: 'result',
      strictLoading: false,
      silentConnect: true,
    });
    const { name, enableLog, expiredTime, strictLoading, silentConnect, private_actionTypes, DefaultLoading, DefaultError } = region;
    expect(name).toBe('result');
    expect(expiredTime).toBe(30000);
    expect(enableLog).toBe(false);
    expect(strictLoading).toBe(false);
    expect(silentConnect).toBe(true);
    expect(DefaultLoading()).toBe(null);
    expect(DefaultError).toBe(undefined);
    expect(private_actionTypes).toEqual({
      LOAD: '@result/LOAD',
      SET: '@result/SET',
    });
  });
  test('set config Default Loading & Error', () => {
    private_setConfig({
      DefaultLoading: () => 'loading',
      DefaultError: () => 'error',
    });
    const { DefaultLoading, DefaultError } = region;
    expect(DefaultLoading()).toBe('loading');
    expect(DefaultError()).toBe('error');
  });
  test('deprecated', () => {
    private_setConfig({
      reducerPath: 'deprecated',
    });
    const { name, private_actionTypes } = region;
    expect(name).toBe('deprecated');
    expect(private_actionTypes).toEqual({
      LOAD: '@deprecated/LOAD',
      SET: '@deprecated/SET',
    });
  });
});
