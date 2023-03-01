import Consul from "consul";
import * as yaml from "js-yaml";
import { deepMerge, updateObjectValue } from "./util-objects";

export default class ConsulKV {
  private watch: any;
  private store: any;
  private storeIndex: number;

  constructor(store: any, index: number, options: any) {
    const { uri, watchKeys } = options;
    const consul = new Consul(uri);
    this.store = store;
    this.storeIndex = index;
    for (const key of watchKeys) {
      consul
        .watch({
          method: consul.kv.get,
          options: { key },
          backoffFactor: 1000,
        })
        .on("change", this.onDataChange.bind(this))
        .on("error", this.onError.bind(this));
    }
  }

  private onDataChange(data: any, res: any) {
    if (!data) return;

    let updateObject = data.Value;

    if (!updateObject) return;

    try {
      updateObject = JSON.parse(data.Value);
    } catch (e) {}

    try {
      updateObject = yaml.load(data.Value);
    } catch (e) {}

    if (typeof updateObject === "object") {
      const merged = deepMerge(
        this.store.get(this.storeIndex) || {},
        updateObject
      );
      this.store.replace(this.storeIndex, merged);
    } else if (typeof updateObject === "string") {
      this.store.updateByPath(this.storeIndex, data.Key, updateObject);
    }
  }

  private onError(err: any) {
    console.log("error:", err);
  }
}
