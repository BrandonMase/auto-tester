/**
 * A snapshot of what the dom looked like at that current moment.
 */
export interface ISnapshot {
  /**
   * The id of the snapshot.
   */
  id: string;
  /**
   * The `innerHTML` of the snapshot
   */
  html: string;
  /**
   * The timestamp of when the snapshot was taken.
   */
  timestamp: number;
}
