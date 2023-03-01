import { describe, expect, it } from "vitest";
import { deepMerge, updateObjectValue } from "../src/util-objects";

describe("should", () => {
  it("deepMerge", () => {
    const obj1 = {
      key1: "value1",
      key2: {
        key3: "value3",
        key4: "value4",
      },
      test: [1, 2, 3],
    };
    const obj2 = {
      key1: "value1-new",
      key2: {
        key4: "value4",
        key5: "value5",
      },
      key3: "value3",
    };
    expect(deepMerge(obj1, obj2)).toEqual({
      key1: "value1-new",
      key3: "value3",
      key2: {
        key3: "value3",
        key4: "value4",
        key5: "value5",
      },
      test: [1, 2, 3],
    });
  });

  it("updateObjectValue", () => {
    const obj = { key: "value" };
    const key = "key1/key2/key3";
    const value = "value";
    expect(updateObjectValue(obj, key, value)).toEqual({
      key: "value",
      key1: {
        key2: {
          key3: "value",
        },
      },
    });
  });
});
