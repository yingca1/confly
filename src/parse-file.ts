import * as path from "path";
import * as fs from "fs";

export default class FileStoreHandler {
  private store: any;
  private storeIndex: number;
  public constructor(store: any, storeIndex: number) {
    this.store = store;
    this.storeIndex = storeIndex;
  }

  private readJsonFileSync(filename: string): any {
    const data = fs.readFileSync(filename, "utf8");
    return JSON.parse(data);
  }

  public handleFileStore(workspace: string, storeConfig: any) {
    const { source, watch } = storeConfig;
    if (source === undefined) {
      throw new Error("source is undefined");
    }

    let filePath: string;
    if (source.startsWith("/")) {
      filePath = path.join(source);
    } else {
      filePath = path.join(workspace, "..", source);
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`file ${filePath} not found`);
    }

    if (watch) {
      fs.watch(filePath, (eventType) => {
        if (eventType === "change") {
          this.store.replace(this.storeIndex, this.readJsonFileSync(filePath));
        }
      });
    }

    return this.readJsonFileSync(filePath);
  }
}
