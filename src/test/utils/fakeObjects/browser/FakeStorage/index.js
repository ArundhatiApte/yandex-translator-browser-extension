"use strict";

const FakeStorage = class {
  constructor(optionalKeyToValue) {
    this[_keyToValue] = optionalKeyToValue || _createEmptyObject();
  }

  // получить все данные
  get(ignoredKeys, onGetted) {
    return onGetted(Object.assign(_createEmptyObject(), this[_keyToValue]));
  }

  set(keyToValue, onSetted) {
    Object.assign(this[_keyToValue], keyToValue);
    onSetted();
  }

  remove(keyOrKeys, onRemoved) {
    if (typeof keyOrKeys === "string") {
      _removeOneEntryFromStorage(this, keyOrKeys, onRemoved);
      return;
    }
    _removeEntriesFromStorage(this, keyOrKeys, onRemoved);
  }
};

const _keyToValue = Symbol();
const _createEmptyObject = Object.create.bind(Object, null);

const _removeOneEntryFromStorage = (fakeStorage, key, onRemoved) => {
  delete fakeStorage[_keyToValue][key];
  onRemoved();
};

const _removeEntriesFromStorage = (fakeStorage, keys, onRemoved) => {
  const keyToValue = fakeStorage[_keyToValue];
  for (const key of keys) {
    delete keyToValue[key];
  }
  onRemoved();
};

export default FakeStorage;
