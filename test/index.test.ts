import { describe, expect, it } from "vitest";
import confly from "../src/index";

describe("should", () => {
  it("exported", () => {
    expect(confly.get("basekey1")).toEqual("basevalue1");
  });
});
