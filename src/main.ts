import path from "path";
import * as yaml from "js-yaml";
import * as fs from "fs";
import argv from "./parse-argv";
import envs from "./parse-env";
import Store from "./store";

function getProjectRootFolder() {
  const projectRootFolder = path.resolve(__dirname, "../");
  return projectRootFolder;
}

// parse confly profiles
function listFoldersInDirectory(dir: string) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((file) => file.name);
}

function listFolderJsonFiles(dir: string) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((file) => file.isFile() && file.name.endsWith(".json"))
    .map((file) => path.join(dir, file.name));
}

function mergeMultJsonFileToObject(files: string[]) {
  const result = files
    .map((file) => {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    })
    .reduce((acc, cur) => {
      return { ...acc, ...cur };
    }, {});
  return result;
}

function setup(conflyPath: string) {
  // confly config file
  const doc: any = yaml.load(fs.readFileSync(conflyPath, "utf8"));

  // active profile
  const activeProfile = doc["profiles"]["active"];
  // console.log(`Active profile: ${activeProfile}`);

  // config workspace directory
  const workspaceHome = path.join(
    getProjectRootFolder(),
    doc["workspace"]["path"]
  );

  const store = new Store(workspaceHome);
  store.setArgvState(argv);

  store.setEnvState(envs);

  const profiles = listFoldersInDirectory(path.join(workspaceHome, "overlays"));

  // console.log(profiles);

  const baseFiles = listFolderJsonFiles(path.join(workspaceHome, "base"));
  const activeProfileFiles = listFolderJsonFiles(
    path.join(workspaceHome, "overlays", activeProfile)
  );

  // console.log(`Base files: ${baseFiles}`);
  // console.log(`Active profile files: ${activeProfileFiles}`);

  const baseConfig = mergeMultJsonFileToObject(baseFiles);
  const activeProfileConfig = mergeMultJsonFileToObject(activeProfileFiles);

  function mergetMultiObject(obj1: any, obj2: any) {
    return { ...obj1, ...obj2 };
  }

  // console.log(`Base config: ${JSON.stringify(baseConfig)}`);
  // console.log(`Active profile config: ${JSON.stringify(activeProfileConfig)}`);

  const state = mergetMultiObject(baseConfig, activeProfileConfig);
  store.setFileState(state);

  return store.getCombinedState();
}

export default setup;
