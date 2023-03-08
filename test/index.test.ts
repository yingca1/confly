import { describe, expect, it } from "vitest";
import confly from "../src/index";

describe("should", () => {
  it("exported", async () => {
    expect(confly).toBeDefined();
  });

  it.skip("exported", () => {
    expect(confly.get("basekey1")).toEqual("basevalue1");
  });
});
