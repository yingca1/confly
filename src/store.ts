import { dumpJsonTofile } from "./snapshot";
import { updateObjectValue } from "./util-objects";

export default class Store {
  private stateList: any[];
  private combinedState: any;
  private rootFolder: string;

  constructor(rootFolder: string) {
    this.stateList = [];
    this.combinedState = {};
    this.rootFolder = rootFolder;
  }

  public add(state: any) {
    this.stateList.push(state);
    this.refreshCombinedState();
  }

  public get(index: number) {
    return this.stateList[index];
  }

  public replace(index: number, state: any) {
    this.stateList[index] = state;
    this.refreshCombinedState();
  }

  public updateByPath(storeIndex: number, path: string, value: any) {
    this.replace(
      storeIndex,
      updateObjectValue(this.get(storeIndex), path, value)
    );
  }

  public getCombinedState() {
    return this.combinedState;
  }

  private refreshCombinedState() {
    this.combinedState = this.stateList
      .filter((obj) => {
        return typeof obj === "object" && obj !== null;
      })
      .reduce((prev, current) => {
        return Object.assign({}, prev, current);
      }, {});
    dumpJsonTofile(this.rootFolder, this.combinedState);
  }
}
