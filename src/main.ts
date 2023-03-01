import path from "path";
import * as yaml from "js-yaml";
import * as fs from "fs";
import argv from "./parse-argv";
import envs from "./parse-env";
import Store from "./store";

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

function listFolderJSFiles(dir: string) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((file) => file.isFile() && file.name.endsWith(".js"))
    .map((file) => path.join(dir, file.name));
}

type MergedObject = { [key: string]: any };

function mergeMultJSFileToObject(filePaths: string[]): MergedObject {
  const mergedObject: MergedObject = {};

  for (const filePath of filePaths) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const module = require(filePath);
    for (const key in module) {
      if (module.hasOwnProperty(key)) {
        mergedObject[key] = module[key];
      }
    }
  }

  return mergedObject;
}

function setup(conflyPath: string, profile?: string) {
  // confly config file
  const doc: any = yaml.load(fs.readFileSync(conflyPath, "utf8"));

  // active profile
  const activeProfile = profile || doc["profiles"]["active"];
  // console.log(`Active profile: ${activeProfile}`);

  // config workspace directory
  const workspaceHome = path.join(
    path.dirname(conflyPath),
    doc["workspace"]["path"]
  );

  const store = new Store(workspaceHome);
  store.setArgvState(argv);

  store.setEnvState(envs);

  const profiles = listFoldersInDirectory(path.join(workspaceHome, "overlays"));

  // console.log(profiles);

  const baseJsonFiles = listFolderJsonFiles(path.join(workspaceHome, "base"));
  const activeProfileJsonFiles = listFolderJsonFiles(
    path.join(workspaceHome, "overlays", activeProfile)
  );

  const baseJSFiles = listFolderJSFiles(path.join(workspaceHome, "base"));
  const activeProfileJSFiles = listFolderJSFiles(
    path.join(workspaceHome, "overlays", activeProfile)
  );

  // console.log(`Base files: ${baseJsonFiles}`);
  // console.log(`Active profile files: ${activeProfileFiles}`);

  const state = {
    ...mergeMultJsonFileToObject(baseJsonFiles),
    ...mergeMultJSFileToObject(baseJSFiles),
    ...mergeMultJsonFileToObject(activeProfileJsonFiles),
    ...mergeMultJSFileToObject(activeProfileJSFiles),
  };

  store.setFileState(state);

  return store.getCombinedState();
}

export default setup;
