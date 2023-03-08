import { describe, expect, it } from "vitest";
import { getRemoteInfo, cloneRepo } from "../src/util-git";

describe("should", () => {
  it.skip("getRemoteInfo", async () => {
    const result = await getRemoteInfo();
    expect(result).toEqual({
      defaultBranch: "main",
      description: "A pure JavaScript implementation of Git",
      homepage: "https://isomorphic-git.org",
      name: "isomorphic-git",
      owner: "isomorphic-git",
      repo: "isomorphic-git",
    });
  });

  it("cloneRepo", async () => {
    await cloneRepo();
  });
});
