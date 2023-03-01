import { getConflyFilePath } from "./util-files";
import setup from "./main";

class Confly {
  private configFilePath: string;
  private store: any;

  constructor(options?: any) {
    const { configPath } = options || {};

    this.configFilePath = getConflyFilePath(configPath);
    this.store = setup(this.configFilePath);
  }

  public get(key: string, defaultValue?: any) {
    return this.store[key] || defaultValue;
  }
}

export default new Confly();
