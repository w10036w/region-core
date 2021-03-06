let store = null;

export const setStore = (_store) => {
  store = _store;
};

export const getStore = () => {
  if (!store || typeof store.dispatch !== 'function' || typeof store.getState !== 'function') {
    throw Error('getProvider must be called before new Region()');
  }
  return store;
};

let reducerObject = null;

export const setReducerObject = (_reducerObject) => {
  reducerObject = _reducerObject;
};

export const getReducerObject = () => reducerObject;
