import { getConflyFilePath } from "./util-files";
import { createDirectoryIfNotExists } from "./util-files";
import fs from "fs";
import Store from "./store";
import path from "path";
import * as yaml from "js-yaml";

class Confly {
  private static instance: Confly;
  private static activiteProfile: string;
  private configFilePath?: string;
  private store?: Store;

  private constructor() {
    // this.init();
  }

  public static getInstance(): Confly {
    if (!Confly.instance) {
      Confly.instance = new Confly();
    }
    return Confly.instance;
  }

  public get(key: string, defaultValue?: any) {
    return (
      this.getJsonValue(this.store?.getCombinedState(), key) || defaultValue
    );
  }

  public setProfile(profile: string) {
    if (profile !== Confly.activiteProfile) {
      Confly.activiteProfile = profile;
      this.store?.updateProfile(Confly.activiteProfile);
    }
  }

  public async init() {
    this.configFilePath = getConflyFilePath();
    this.setupConflyFile();
    await this.initStore(this.configFilePath, Confly.activiteProfile);
  }

  private getJsonValue(obj: any, keyString: string) {
    const keys = keyString.split(":");
    let value = obj;
    for (const key of keys) {
      if (!value.hasOwnProperty(key)) {
        return undefined;
      }
      value = value[key];
    }
    return value;
  }

  private setupConflyFile() {
    if (!this.configFilePath) {
      throw new Error("confly.yml file not found");
    }

    if (!fs.existsSync(this.configFilePath)) {
      const conflySettings = {
        workspace: {
          path: ".confly",
        },
        stores: [
          {
            type: "argv",
            enable: true,
            priority: 999,
          },

          {
            type: "env",
            enable: true,
            priority: 998,
          },
        ],
        profiles: {
          active: "default",
        },
      };
      fs.writeFileSync(
        this.configFilePath,
        yaml.dump(conflySettings, { lineWidth: 1000 })
      );
    }
  }

  private async initStore(conflyPath: string, profile?: string) {
    // parse confly.yml, get confly settings Object
    const conflySettings: any = yaml.load(fs.readFileSync(conflyPath, "utf8"));

    // config workspace directory
    const workspaceHome = path.join(
      path.dirname(conflyPath),
      conflySettings["workspace"]["path"]
    );
    createDirectoryIfNotExists(workspaceHome);

    // get active profile
    const activeProfile = profile || conflySettings["profiles"]["active"];

    // initialize store
    this.store = new Store(workspaceHome, conflySettings.stores, activeProfile);
    await this.store.init();
  }
}

export default Confly.getInstance();
