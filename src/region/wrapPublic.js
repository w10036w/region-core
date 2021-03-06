import { formatResult } from '../util/formatResult';
import { isAsync } from '../util/isAsync';
import { shouldThrottle } from '../util/shouldThrottle';
import { getStore } from '../global/store';

const toPromise = async ({ asyncFunction, params }) => {
  if (typeof asyncFunction === 'function') {
    return asyncFunction(params);
  }
  // promise
  return asyncFunction;
};

export default (Region) => {
  class RegionPublic extends Region {
    /**
     * @param format A function format result to other data structure
     */
    set = (key, result, { format } = {}) => {
      const { getResults, private_actionTypes } = this;
      const { SET } = private_actionTypes;
      const { dispatch } = getStore();
      const snapshot = getResults(key);

      const formattedResult = formatResult({ result, snapshot, key, format });
      dispatch({ type: SET, payload: { key, result: formattedResult } });
      return formattedResult;
    }

    /**
     * @param params asyncFunction may need
     * @param format A function format result to other data structure
     * @param forceUpdate true | false
     */
    load = async (key, asyncFunction, { forceUpdate, params, format, id } = {}) => {
      if (!isAsync(asyncFunction)) {
        console.warn('set result directly');
        const { set } = this;
        return set(key, asyncFunction);
      }

      const { getResults, private_actionTypes, expiredTime, getFetchTimes } = this;
      const { LOAD, SET } = private_actionTypes;
      const { dispatch } = getStore();
      const snapshot = getResults(key);
      if (shouldThrottle({ asyncFunction, forceUpdate, key, snapshot, id, expiredTime, getFetchTimes })) {
        return snapshot;
      }

      dispatch({ type: LOAD, payload: { key } });
      try {
        const result = await toPromise({ asyncFunction, params });
        const formattedResult = formatResult({ result, snapshot, format, id });
        dispatch({ type: SET, payload: { key, result: formattedResult, withLoadEnd: true } });
        return formattedResult;
      } catch (error) {
        const formattedResult = formatResult({ error, snapshot, format, id });
        dispatch({ type: SET, payload: { key, result: formattedResult, error, withLoadEnd: true } });
        return formattedResult;
      }
    }
  }
  return RegionPublic;
};
