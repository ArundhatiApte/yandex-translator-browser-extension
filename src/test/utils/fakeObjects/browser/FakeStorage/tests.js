"use strict";

import {
  strictEqual as expectEqual,
  // без свойства prototype
  deepEqual as expectDeepEqual
} from "assert";

import doesObjectHaveEntries from "../../../../../main/common/js/utils/doesObjectHaveEntries.js";
import {
  getAllFromStorageAsync,
  setToStorageAsync,
  removeFromStorageAsync
} from "../../../../../main/common/js/utils/webExtensions/utilsForStorage.js";

import { addTestsFromTable } from "../../../addingTestsFromTable.js";
import FakeStorage from "./index.js";


const testGettingAddingUpdatingRemoving = async () => {
  const storage = new FakeStorage();

  const key1 = "один";
  const key2 = "другой";
  const key3 = "ещё";
  const key4 = "последний";

  await checkThatStorageIsEmpty(storage);

  const data1 = { a: "А"};
  let data2 = [1, 2, 3, 4];
  const data3 = { abcd: 1234 };
  let data4 = { a4: "f4" };

  const savedData = {
    [key1]: data1,
    [key2]: data2,
    [key3]: data3,
    [key4]: data4
  };

  await setToStorageAsync(storage, savedData);
  await checkGettingAllDataFromStorage(storage, savedData);

  data2 = [5, 6, 7, 8];
  data4 = { zx: 4 };
  savedData[key2] = data2;
  savedData[key4] = data4;

  await setToStorageAsync(storage, {
    [key2]: data2,
    [key4]: data4
  });
  await checkGettingAllDataFromStorage(storage, savedData);

  await removeFromStorageAsync(storage, key1);
  delete savedData[key1];
  await checkGettingAllDataFromStorage(storage, savedData);

  await removeFromStorageAsync(storage, [key2, key3]);
  delete savedData[key2];
  delete savedData[key3];
  await checkGettingAllDataFromStorage(storage, savedData);
};

const checkGettingAllDataFromStorage = async (storage, expectedData) => {
  const storedData = await getAllFromStorageAsync(storage);
  expectDeepEqual(expectedData, storedData);
};

const checkThatStorageIsEmpty = async (storage) => {
  const storedData = await getAllFromStorageAsync(storage);
  expectEqual(false, doesObjectHaveEntries(storedData));
};

const testCreatingWithData = async () => {
  const savedData = {
    first: ["a", "b"],
    second: [1, 2, 3, 4]
  };
  const storage = new FakeStorage(savedData);
  await checkGettingAllDataFromStorage(storage, savedData);
};

describe("тест поддельного хранилища по образу из WebExtension", () => (
  addTestsFromTable(it, [
    ["получение, добавление, обновление, удаление", testGettingAddingUpdatingRemoving],
    ["создание с записями", testCreatingWithData]
  ])
));
