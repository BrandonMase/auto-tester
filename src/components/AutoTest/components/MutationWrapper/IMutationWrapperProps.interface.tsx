import { IMappedState } from "../../interfaces/IMappedState";

export interface IMutationWrapperProps {
  /** The whole mutation map that happened. */
  mutationEvent: IMappedState;
}
