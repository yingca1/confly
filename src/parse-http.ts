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

  private downloadFile(url: string, token?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: https.RequestOptions = {};

      if (token) {
        options.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      const req = https.get(url, options, (res) => {
        if (res.statusCode !== 200) {
          reject(
            new Error(
              `Failed to download file: ${res.statusCode} ${res.statusMessage}`
            )
          );
          return;
        }

        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      });

      req.on("error", (err) => {
        reject(err);
      });
    });
  }

  public async handleHttpStore(storeConfig: any) {
    const { source, watch, interval, token } = storeConfig;
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
          const content = await this.downloadFile(source, token);
          this.store.replace(this.storeIndex, JSON.parse(content));
        } catch (err) {
          console.error((err as Error).message);
        }
      }, intervalValue * 1000);
    }

    const content = await this.downloadFile(source, token);
    return JSON.parse(content);
  }
}
