import { getConflyFilePath } from "./util-files";
import setup from "./main";

class Confly {
  private static activiteProfile: string;
  private configFilePath: string;
  private store: any;

  constructor(options?: any) {
    const { configPath } = options || {};

    this.configFilePath = getConflyFilePath(configPath);
    this.store = setup(this.configFilePath, Confly.activiteProfile);
  }

  public setProfile(profile: string) {
    Confly.activiteProfile = profile;
    this.store = setup(this.configFilePath, Confly.activiteProfile);
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

  public get(key: string, defaultValue?: any) {
    return this.getJsonValue(this.store, key) || defaultValue;
  }

  public print() {
    console.log(this.configFilePath);
    console.log(this.store);
  }
}

export default new Confly();
