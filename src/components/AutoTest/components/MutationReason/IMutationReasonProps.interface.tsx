import { ITriggerEvent } from "../../interfaces/ITriggerEvent";

export interface IMutationReasonProps {
  /** The reason a rerender happened. */
  triggerEvent: ITriggerEvent;
  /** The `DOM` before the rerender occured. */
  DOM: HTMLDivElement;
}
