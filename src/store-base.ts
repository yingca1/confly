abstract class BaseStore {
  workspace: string;
  constructor(workspace: string) {
    this.workspace = workspace;
  }

  abstract init(options: object): Promise<void>;

  abstract destroy(): void;

  abstract refreshState(): object;
}

export default BaseStore;
