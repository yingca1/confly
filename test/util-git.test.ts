import { describe, expect, it } from "vitest";
import { getRemoteInfo, cloneRepo } from "../src/util-git";

describe("should", () => {
  it.skip("getRemoteInfo", async () => {
    const result = await getRemoteInfo(
      "https://github.com/yingca1/confly-examples.git"
    );
    // expect(result).toEqual({
    //   name: "confly-examples",
    //   owner: "yingca1",
    //   branch: "master",
    // });
  });

  it.skip("cloneRepo", async () => {
    await cloneRepo(
      "https://github.com/yingca1/confly-examples.git",
      "/Users/caiying/Code/github.com/yingca1/confly/.confly/test"
    );
  });
});
