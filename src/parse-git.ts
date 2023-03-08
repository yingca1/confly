import * as fs from "fs";
import path from "path";

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

function setupGitFolder(activeProfile: string, configFolder: string): any {
  const baseJsonFiles = listFolderJsonFiles(path.join(configFolder, "base"));
  const activeProfileJsonFiles = listFolderJsonFiles(
    path.join(configFolder, "overlays", activeProfile)
  );

  const baseJSFiles = listFolderJSFiles(path.join(configFolder, "base"));
  const activeProfileJSFiles = listFolderJSFiles(
    path.join(configFolder, "overlays", activeProfile)
  );

  const state = {
    ...mergeMultJsonFileToObject(baseJsonFiles),
    ...mergeMultJSFileToObject(baseJSFiles),
    ...mergeMultJsonFileToObject(activeProfileJsonFiles),
    ...mergeMultJSFileToObject(activeProfileJSFiles),
  };

  return state;
}

export { setupGitFolder };
