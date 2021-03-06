import { shouldThrottle } from '../shouldThrottle';

const getFetchTimes = () => 0;

describe('shouldThrottle', () => {
  test('empty', () => {
    expect(shouldThrottle({
      getFetchTimes,
    })).toEqual(false);
  });

  test('promise', () => {
    expect(shouldThrottle({
      asyncFunction: Promise.resolve(),
      getFetchTimes,
    })).toEqual(false);
  });

  test('id', () => {
    expect(shouldThrottle({
      id: 0,
    })).toEqual(false);
  });

  test('id not hit', () => {
    expect(shouldThrottle({
      id: 0,
      snapshot: { 1: 'user' },
    })).toEqual(false);
  });

  test('id hit', () => {
    expect(shouldThrottle({
      id: 0,
      snapshot: { 0: 'user' },
    })).toEqual(true);
  });

  test('expiredTime 0', () => {
    expect(shouldThrottle({
      asyncFunction: () => null,
      expiredTime: 0,
      snapshot: 'snapshot',
      getFetchTimes: () => 10000000000000,
    })).toEqual(false);
  });

  test('func', () => {
    expect(shouldThrottle({
      asyncFunction: () => null,
      expiredTime: 1,
      snapshot: 'snapshot',
      getFetchTimes,
    })).toEqual(false);
  });

  test('asyncFunction', () => {
    expect(shouldThrottle({
      asyncFunction: () => Promise.resolve(),
      expiredTime: 1,
      snapshot: 'snapshot',
      getFetchTimes,
    })).toEqual(false);
  });

  test('func expired', () => {
    expect(shouldThrottle({
      asyncFunction: () => null,
      expiredTime: 1,
      snapshot: 'snapshot',
      getFetchTimes: () => 10000000000000,
    })).toEqual(true);
  });

  test('asyncFunction expired', () => {
    expect(shouldThrottle({
      asyncFunction: () => Promise.resolve(),
      expiredTime: 1,
      snapshot: 'snapshot',
      getFetchTimes: () => 10000000000000,
    })).toEqual(true);
  });
});
