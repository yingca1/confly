import * as fs from "fs";
import * as path from "path";

function createSnapshotFolderIfNotExists(fodlerPath: string) {
  if (!fs.existsSync(fodlerPath)) {
    fs.mkdirSync(fodlerPath);
  }
}

/**
 * format to yyyy-MM-dd-HH-mm-ss.SSS, e.g. 2021-01-01-12-00-00.000
 */
function formatTime(time: number) {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}.${milliseconds}`;
}

function backupOldSnapshotFile(snapshotFilePath: string) {
  if (fs.existsSync(snapshotFilePath)) {
    const oldSnapshotFilePath = path.join(
      path.dirname(snapshotFilePath),
      `snapshot.${formatTime(new Date().getTime())}.json`
    );
    fs.renameSync(snapshotFilePath, oldSnapshotFilePath);
  }
}

function dumpJsonTofile(rootFolder: string, profile: string, jsonObject: any) {
  const snapshotFolder = path.join(rootFolder, "snapshots");
  createSnapshotFolderIfNotExists(snapshotFolder);
  const snapshotFilePath = path.join(snapshotFolder, `${profile}.json`);
  //   backupOldSnapshotFile(snapshotFilePath);
  fs.writeFileSync(snapshotFilePath, JSON.stringify(jsonObject, null, 2));
}

function dumpSnapshotToFolder(rootFolder: string, jsonObject: any) {
  const snapshotFolder = path.join(rootFolder);
  const snapshotFilePath = path.join(snapshotFolder, `snapshot.json`);
  fs.writeFileSync(snapshotFilePath, JSON.stringify(jsonObject, null, 2));
}

export { dumpJsonTofile, dumpSnapshotToFolder };
