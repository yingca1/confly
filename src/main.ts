import path from "path";
import * as yaml from "js-yaml";
import * as fs from "fs";
import argv from "./parse-argv";
import envs from "./parse-env";
import Store from "./store";
import { setupGitFolder } from "./parse-git";
import ConsulKV from "./parse-consul";

function setup(
  conflyPath: string,
  isOnlyUpdateProfile: boolean,
  profile?: string
) {
  // confly config file
  const conflySettings: any = yaml.load(fs.readFileSync(conflyPath, "utf8"));
  // config workspace directory
  const workspaceHome = path.join(
    path.dirname(conflyPath),
    conflySettings["workspace"]["path"]
  );
  const activeProfile = profile || conflySettings["profiles"]["active"];
  const store = new Store(workspaceHome);

  // const storeSize = conflySettings["stores"].length.toString().length;
  for (const [index, storeConfig] of Object.entries(conflySettings.stores)) {
    const type = (storeConfig as any).type;
    // console.log(`${index.padStart(storeSize, "0")}-${type}`, storeConfig);
    if (isOnlyUpdateProfile) {
      if (type === "git")
        store.replace(
          Number(index),
          setupGitFolder(activeProfile, workspaceHome)
        );
    } else {
      switch (type) {
        case "git":
          store.add(setupGitFolder(activeProfile, workspaceHome));
          break;
        case "env":
          store.add(envs);
          break;
        case "argv":
          store.add(argv);
          break;
        case "consul":
          new ConsulKV(store, Number(index), storeConfig);
          break;
        default:
          break;
      }
    }
  }

  return store.getCombinedState();
}

function initialize(conflyPath: string, profile?: string) {
  // console.log(`initialize(${conflyPath}, ${profile})`);
  const store = setup(conflyPath, false, profile);
  return store;
}

function updateProfile(conflyPath: string, profile: string) {
  const store = setup(conflyPath, true, profile);
  return store;
}

export { initialize, updateProfile };
