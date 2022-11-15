/**
 * The reason a rerender happened.
 */
export interface ITriggerEvent {
  /** Which type of event triggered the rerender */
  eventType: string;
  /** The `event_id` of the `Element` that triggered it */
  event_id: string;
  /** The `id` of the snapshot. */
  snapshotId: string;
  /** The timestamp of when the snapshot was taken. */
  timestamp: number;
}
