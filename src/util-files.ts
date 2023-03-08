import * as fs from "fs";
import * as path from "path";

function removeDirectoryIfExists(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true });
  }
}

function createDirectoryIfNotExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function findPackageJsonFolderPath(startPath: string): string | null {
  let currentPath = startPath;
  while (true) {
    const packageJsonPath = path.join(currentPath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      return currentPath;
    }
    const parentPath = path.resolve(currentPath, "..");
    if (parentPath === currentPath) {
      return null;
    }
    currentPath = parentPath;
  }
}

function getConflyFilePath(): string {
  const packageJsonFolderPath = findPackageJsonFolderPath(process.cwd());
  if (!packageJsonFolderPath) {
    throw new Error("package.json not found");
  }
  return path.join(packageJsonFolderPath, "confly.yml");
}

export {
  createDirectoryIfNotExists,
  removeDirectoryIfExists,
  getConflyFilePath,
};
