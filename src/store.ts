/**
 * init store to save the final state in-memory.
 */
import { dumpJsonTofile } from "./snapshot";

export default class {
  private fileState: any;
  private literalState: any;
  private envState: any;
  private argvState: any;
  private combinedState: any;
  private rootFolder: string;

  constructor(rootFolder: string) {
    this.fileState = {};
    this.literalState = {};
    this.envState = {};
    this.argvState = {};
    this.combinedState = {};
    this.rootFolder = rootFolder;
  }

  public setFileState(state: any) {
    this.fileState = state;
    this.updateCombineState();
  }

  public setLiteralState(state: any) {
    this.literalState = state;
    this.updateCombineState();
  }

  public setEnvState(state: any) {
    this.envState = state;
    this.updateCombineState();
  }

  public setArgvState(state: any) {
    this.argvState = state;
    this.updateCombineState();
  }

  public getCombinedState() {
    return this.combinedState;
  }

  private updateCombineState() {
    this.combinedState = {
      ...this.fileState,
      ...this.literalState,
      ...this.envState,
      ...this.argvState,
    };
    dumpJsonTofile(this.rootFolder, this.combinedState);
  }
}
