export type TEvent = "REMOVED" | "ADDED" | "ATTRIBUTE";

export enum MutationEvents {
  REMOVED,
  ADDED,
  ATTRIBUTE,
}

export interface IMutationEvents {
  REMOVED: "REMOVED";
  ADDED: "ADDED";
  ATTRIBUTE: "ATTRIBUTE";
}
export const MUTATION_EVENTS: IMutationEvents = {
  REMOVED: "REMOVED",
  ADDED: "ADDED",
  ATTRIBUTE: "ATTRIBUTE",
};
/**
 * A Mutation that happened on the DOM.
 */
export interface IMutation {
  /**
   * The type of event that happened
   */
  type: keyof IMutationEvents;
  /**
   * The `dataset.event_id` of the HTML Element that got mutated
   */
  event_id: string;
  /**
   * The timestamp of when the mutation happened.
   */
  timestamp: number;
  /**
   * The snapshot id of the snapshot before the mutation happened.
   */
  snapshotId: string;
  /**
   * The previous value of the mutation
   */
  prevValue?: any;
  /**
   * The new value of the mutation
   */
  newValue?: any;
  /**
   * The attribute that got changed on the mutation.
   */
  attribute?: string;
}

export interface IMutationAttribute {
  /**
   * The previous value of the mutation
   */
  prevValue: any;
  /**
   * The new value of the mutation
   */
  newValue: any;
  /**
   * The attribute that got changed on the mutation.
   */
  attribute: string;
}
