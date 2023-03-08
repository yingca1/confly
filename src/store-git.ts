import path from "path";
import BaseStore from "./store-base";
import { setupGitFolder } from "./parse-git";
import { cloneRepo } from "./util-git";

class GitStore extends BaseStore {
  options: any;
  gitFolder: string;
  activeProfile: string;
  constructor(workspace: string, options: any = {}, profile: string) {
    super(workspace);
    this.gitFolder = path.join(this.workspace, "repo");
    this.options = options;
    this.activeProfile = profile;
  }
  public async init() {
    const { source } = this.options;
    await cloneRepo(source.repoURL, this.gitFolder);
  }

  public refreshState() {
    return setupGitFolder(
      this.activeProfile,
      path.join(this.gitFolder, this.options.source.path)
    );
  }
}

export default GitStore;
