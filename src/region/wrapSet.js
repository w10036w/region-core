import { formatResult } from '../util/formatResult';
import { setResult } from '../util/constant';
import { getStore } from '../global/store';

export default (RegionIn) => {
  class Region extends RegionIn {
    constructor() {
      super();
      this.set = this.set.bind(this);
    }

    /**
     * @param format A function format result to other data structure
     */
    set(key, result, { format } = {}) {
      const { getResults: getSnapshot } = this;
      const { dispatch } = getStore();
      const snapshot = getSnapshot(key);

      const formattedResult = formatResult({ result, snapshot, key, format });
      dispatch({ type: setResult, payload: { key, result: formattedResult } });
      return formattedResult;
    }
  }
  return Region;
};