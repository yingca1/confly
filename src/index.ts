import { getConflyFilePath } from "./util-files";
import { initialize, updateProfile } from "./main";

class Confly {
  private static instance: Confly;
  private static activiteProfile: string;
  private configFilePath: string;
  private store: any;

  private constructor() {
    this.configFilePath = getConflyFilePath();
    // console.log(this.configFilePath, Confly.activiteProfile);
    this.store = initialize(this.configFilePath, Confly.activiteProfile);
  }

  public static getInstance(): Confly {
    if (!Confly.instance) {
      Confly.instance = new Confly();
    }
    return Confly.instance;
  }

  public setProfile(profile: string) {
    if (profile !== Confly.activiteProfile) {
      Confly.activiteProfile = profile;
      this.store = updateProfile(this.configFilePath, Confly.activiteProfile);
    }
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

export default Confly.getInstance();
