import { region, getResults as getSnapshot } from './util/region';
import { setLoading, setResult } from './util/constant';
import { groupError } from './util/logger';
import { isAsync } from './util/isAsync';
import { shouldThrottle } from './util/shouldThrottle';

const getStore = () => {
  const { store } = region;
  if (!store || typeof store.dispatch !== 'function' || typeof store.getState !== 'function') {
    throw Error('setConfig({ store }) must be called');
  }
  return store;
};

const formatResult = (result, snapshot, key, format) => {
  if (typeof format !== 'function') {
    return result;
  }
  try {
    const formattedResult = format(result, snapshot);
    return formattedResult;
  } catch (e) {
    groupError(`Catch an error when format ${key}, return null instead.`, e);
    return null;
  }
};

/**
 * @param format A function format result to other data structure
 */
export const set = (key, result, { format } = {}) => {
  const { dispatch } = getStore();
  const snapshot = getSnapshot(key);

  const formattedResult = formatResult(result, snapshot, key, format);
  dispatch({ type: setResult, payload: { key, result: formattedResult } });
  return formattedResult;
};

const toPromise = async ({ Promise, params }) => {
  if (typeof Promise === 'function') {
    return Promise(params);
  }
  // promise
  return Promise;
};

/**
 * @param params Promise may need
 * @param format A function format result to other data structure
 * @param forceUpdate true | false
 */
export const load = async (key, Promise, { forceUpdate, params, format } = {}) => {
  if (!isAsync(Promise)) {
    console.warn('set result directly');
    return set(key, Promise);
  }

  const { dispatch } = getStore();
  const snapshot = getSnapshot(key);
  if (shouldThrottle({ Promise, forceUpdate, key, snapshot })) {
    return snapshot;
  }
  dispatch({ type: setLoading, payload: { key } });
  const result = await toPromise({ Promise, params });

  const formattedResult = formatResult(result, snapshot, key, format);
  dispatch({ type: setResult, payload: { key, result: formattedResult } });
  return formattedResult;
};
