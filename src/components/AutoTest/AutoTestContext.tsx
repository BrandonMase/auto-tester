import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IAutoTestContext } from "./interfaces/IAutoTestProviderProps";
import { IMappedState } from "./interfaces/IMappedState";
import { ISnapshot } from "./interfaces/ISnapshot";
import { createTestGet } from "./testingUtils";
import { createDOMFromSnapshot, useEventListeners } from "./useEventListener";
import { useRenderShapshot } from "./useHooks/useRenderSnapshot";

const AutoTestContext = React.createContext<IAutoTestContext | null>(null);

export const AutoTestProvider = (props: { children: any }) => {
  const { snapshots, events, domActions } = useEventListeners();
  const [mappedState, setMappedState] = useState(
    new Map<string, IMappedState>()
  );
  const testRef = useRef('');

  const { snapshotSelected, setSnapshotSelected } = useRenderShapshot();

  /**
   * Returns the `ISnapshot` of the passed in `id`.
   * @param id - The id of the snapshot.
   */
  const getSnapshotById = useCallback((id: string) =>
    snapshots.current.find((e) => e.id === id) as ISnapshot,[snapshots]);

  /**
   * Returns all of the dom actions from a snapshot.
   * @param id - The id of the snapshot
   */
  const getDomActionsBySnapshotId = useCallback((id: string) =>
    domActions.filter((e) => e.snapshotId === id), [domActions]);

  /**
   * Updates the current mapped state when anything changes.
   */
  useEffect(() => {
    const newMappedState = new Map();

    events.forEach((e, i: number) => {
      newMappedState.set(e.snapshotId, {
        triggerEvent: e,
        snapshot: getSnapshotById(e.snapshotId),
        DOM: createDOMFromSnapshot(getSnapshotById(e.snapshotId) as ISnapshot),
        nextDOM:
          events[i + 1] !== undefined
            ? createDOMFromSnapshot(
                getSnapshotById(events[i + 1].snapshotId) as ISnapshot
              )
            : document.querySelector("#UUID") as HTMLDivElement,
        mutations: getDomActionsBySnapshotId(e.snapshotId),
      });
    });

    createTestRef(newMappedState);
    setMappedState(newMappedState);
  }, [snapshots, events, domActions, getSnapshotById, getDomActionsBySnapshotId]);

  const createTestRef = (state: Map<string, IMappedState>) => {
    const test = '';

    const VALUES = Array.from(state.values());
    
    for(let i = 0; i < VALUES.length; i++) {
      const CURR_EVENT = VALUES[i];
      for(let j = 0; j < CURR_EVENT.mutations.length; j++) {
        console.log(createTestGet(CURR_EVENT.mutations[j], CURR_EVENT.DOM as HTMLDivElement, CURR_EVENT.nextDOM))
      }
    }
  }

  return (
    <AutoTestContext.Provider
      value={{ mappedState, snapshotSelected, setSnapshotSelected }}
    >
      {props.children}
    </AutoTestContext.Provider>
  );
};

export const useAutoTestContext = () => {
  const context = useContext(AutoTestContext);

  if (!context) {
    throw new Error(
      "You need to be inside of the AutoTestContext to use useAutoTextContext"
    );
  }

  return context;
};
