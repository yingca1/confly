import path from "path";
import argv from "./parse-argv";
import envs from "./parse-env";
import FileStoreHandler from "./parse-file";
import HttpStoreHandler from "./parse-http";
import { dumpJsonTofile, dumpSnapshotToFolder } from "./snapshot";
import { updateObjectValue } from "./util-objects";
import {
  createDirectoryIfNotExists,
  removeDirectoryIfExists,
} from "./util-files";

export default class Store {
  private stateList: any[];
  private combinedState: any;
  private workspace: string;
  private storeRoot: string;
  private storeConfigList: any;

  constructor(workspace: string, config: any) {
    this.stateList = [];
    this.combinedState = {};
    this.workspace = workspace;
    this.storeRoot = path.join(workspace, "store");
    this.storeConfigList = config;

    // remove store folder if exists
    removeDirectoryIfExists(this.storeRoot);

    // sort stores by priority
    this.storeConfigList.sort((a: any, b: any) => {
      return a.priority - b.priority;
    });

    // this.init();
  }

  public async init() {
    // for loop to initialize stores
    for (const [index, storeConfig] of this.storeConfigList.entries()) {
      // check priority in store config should be number and in range 0-999
      if (
        typeof storeConfig.priority !== "number" ||
        storeConfig.priority < 0 ||
        storeConfig.priority > 999
      ) {
        throw new Error(
          `Store priority should be a number in range 0-999, but got ${storeConfig.priority}`
        );
      }

      // if enabled is false, skip this store
      if (storeConfig.enabled === false) {
        continue;
      }

      // format store folder path as <priority><index>-<type>, priority use 3 chars, index use 3 chars
      const storeFolder = `${storeConfig.priority
        .toString()
        .padStart(3, "0")}${index.toString().padStart(3, "0")}-${
        storeConfig.type
      }`;

      const storeFolderPath = path.join(this.storeRoot, storeFolder);

      // create store folder if not exists
      createDirectoryIfNotExists(storeFolderPath);

      switch (storeConfig.type) {
        case "file":
          const hanlder = new FileStoreHandler(this, index);
          const fileStore = hanlder.handleFileStore(
            this.workspace,
            storeConfig
          );
          if (fileStore !== null) {
            this.add(fileStore);
            dumpSnapshotToFolder(storeFolderPath, fileStore);
          }
          break;
        case "http":
          const httpHanlder = new HttpStoreHandler(this, index);
          const httpStore = await httpHanlder.handleHttpStore(
            storeFolderPath,
            storeConfig
          );
          if (httpStore !== null) {
            this.add(httpStore);
          }
          break;
        case "env":
          this.add(envs);
          dumpSnapshotToFolder(storeFolderPath, envs);
          break;
        case "argv":
          this.add(argv);
          dumpSnapshotToFolder(storeFolderPath, argv);
          break;
        default:
          break;
      }
    }
  }

  public add(state: any) {
    this.stateList.push(state);
    this.refreshCombinedState();
  }

  public get(index: number) {
    return this.stateList[index];
  }

  public replace(index: number, state: any) {
    this.stateList[index] = state;
    this.refreshCombinedState();
  }

  public updateByPath(storeIndex: number, path: string, value: any) {
    this.replace(
      storeIndex,
      updateObjectValue(this.get(storeIndex), path, value)
    );
  }

  public getCombinedState() {
    return this.combinedState;
  }

  private refreshCombinedState() {
    this.combinedState = this.stateList
      .filter((obj) => {
        return typeof obj === "object" && obj !== null;
      })
      .reduce((prev, current) => {
        return Object.assign({}, prev, current);
      }, {});
    dumpJsonTofile(this.workspace, "snapshot", this.combinedState);
  }
}
