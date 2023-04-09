import * as https from "https";
import * as path from "path";
import * as fs from "fs";

export default class HttpStoreHandler {
  private store: any;
  private storeIndex: number;
  public constructor(store: any, storeIndex: number) {
    this.store = store;
    this.storeIndex = storeIndex;
  }

  private downloadJsonFile(url: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = https.get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(
            new Error(
              `Failed to download file: ${res.statusCode} ${res.statusMessage}`
            )
          );
          return;
        }

        const file = fs.createWriteStream(filename);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      });

      req.on("error", (err) => {
        reject(err);
      });
    });
  }

  public async handleHttpStore(storeFolderPath: string, storeConfig: any) {
    const { source, watch, interval } = storeConfig;
    if (source === undefined) {
      throw new Error("source is undefined");
    }

    let intervalValue = interval;
    if (interval === undefined || interval <= 30) {
      intervalValue = 30;
    }

    if (watch) {
      setInterval(async () => {
        try {
          const content = await this.downloadJsonFile(
            source,
            path.join(storeFolderPath, "snapshot.json")
          );
          this.store.replace(this.storeIndex, content);
        } catch (err) {
          console.error(err);
        }
      }, intervalValue * 1000);
    }

    return await this.downloadJsonFile(
      source,
      path.join(storeFolderPath, "snapshot.json")
    );
  }
}
