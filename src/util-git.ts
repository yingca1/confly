import * as fs from "fs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";

async function getRemoteInfo(): Promise<any> {
  return git.getRemoteInfo({
    http,
    url: "https://github.com/isomorphic-git/isomorphic-git",
  });
}

async function cloneRepo() {
  try {
    await git.clone({
      fs,
      http,
      dir: "./my-repo",
      url: "https://github.com/yingca1/confly.git",
      singleBranch: true,
      depth: 1,
    });
    console.log("Cloned successfully!");
  } catch (error) {
    console.error(error);
  }
}

export { getRemoteInfo, cloneRepo };
