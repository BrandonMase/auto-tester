import { IMutation } from "./IMutation";
import { ISnapshot } from "./ISnapshot";
import { ITriggerEvent } from "./ITriggerEvent";

export interface IMappedState {
  triggerEvent: ITriggerEvent;
  snapshot: ISnapshot;
  DOM: HTMLDivElement | null;
  nextDOM: HTMLDivElement;
  mutations: Array<IMutation>;
}
