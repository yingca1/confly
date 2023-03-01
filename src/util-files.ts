import * as fs from "fs";
import * as path from "path";

function findPackageJsonPath(startPath: string): string | null {
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
  return path.join(findPackageJsonPath(process.cwd()) || "", "confly.yml");
}

export { getConflyFilePath };
