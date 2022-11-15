import { IMappedState } from "./IMappedState";
import { ISnapshot } from "./ISnapshot";
import { IUseState } from "./IUseState";

export interface IAutoTestContext {
  mappedState: Map<string, IMappedState>;
  snapshotSelected: ISnapshot | null;
  setSnapshotSelected: IUseState<ISnapshot | null>;
}
