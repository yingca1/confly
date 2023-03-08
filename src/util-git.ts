import * as fs from "fs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";

async function getRemoteInfo(url: string): Promise<any> {
  return await git.getRemoteInfo({
    http,
    url,
  });
}

async function cloneRepo(source: string, destination: string): Promise<any> {
  try {
    return await git.clone({
      fs,
      http,
      dir: destination,
      url: source,
      singleBranch: true,
      depth: 1,
    });
  } catch (error) {
    console.error(error);
  }
}

export { getRemoteInfo, cloneRepo };
