import * as fs from "fs";
import path from "path";
import { dumpJsonTofile } from "./snapshot";

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

function listProfiles(configFolder: string) {
  return fs
    .readdirSync(path.join(configFolder, "overlays"), { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((file) => file.name);
}

function synth(configFolder: string) {
  const profiles = listProfiles(configFolder);
  console.log(`profiles: ${profiles}`);

  const baseJsonFiles = listFolderJsonFiles(path.join(configFolder, "base"));
  const baseJSFiles = listFolderJSFiles(path.join(configFolder, "base"));

  const baseState = {
    ...mergeMultJsonFileToObject(baseJsonFiles),
    ...mergeMultJSFileToObject(baseJSFiles),
  };
  dumpJsonTofile(configFolder, "base", baseState);

  for (const profile of profiles) {
    const activeProfileJsonFiles = listFolderJsonFiles(
      path.join(configFolder, "overlays", profile)
    );
    const activeProfileJSFiles = listFolderJSFiles(
      path.join(configFolder, "overlays", profile)
    );

    const state = {
      ...baseState,
      ...mergeMultJsonFileToObject(activeProfileJsonFiles),
      ...mergeMultJSFileToObject(activeProfileJSFiles),
    };

    dumpJsonTofile(configFolder, profile, state);
  }
}

function print(options: any) {
  const configFolder = options.dir;

  const baseSnapshot = path.join(configFolder, "snapshots", "base.json");

  let state = {
    ...mergeMultJsonFileToObject([baseSnapshot]),
  };
  const profile = options.profile;
  if (profile) {
    state = {
      ...state,
      ...mergeMultJsonFileToObject([
        path.join(configFolder, "snapshots", `${profile}.json`),
      ]),
    };
  }

  console.log(JSON.stringify(state, null, 2));
}

export { synth, print };
