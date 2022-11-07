"use strict";

export const getAllFromStorageAsync = (storage) => {
  return new Promise((resolve) => (storage.get(null, resolve)));
};

export const setToStorageAsync = (storage, keyToValue) => {
  return new Promise((resolve) => (storage.set(keyToValue, resolve)));
};

export const removeFromStorageAsync = (storage, keyOrKeys) => {
  return new Promise((resolve) => (storage.remove(keyOrKeys, resolve)));
};
