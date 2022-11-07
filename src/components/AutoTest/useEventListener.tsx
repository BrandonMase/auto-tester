import { debugPort } from "process";
import { stringify } from "querystring";
import { useEffect, useRef, useState } from "react";
import { inherits } from "util";
import { ISnapshot, useOnMount, waitForUUIDToBePresent } from "./Sidebar";
import { guidGenerator } from "./utils";

/* 
TODO -> Figure out why snapshots aren't being updated when passed into the Mutation Observer callback when snapshots is a useState instead of useRef. This causes the sidebar not to rerender when a new snapshot is added. This may be a problem.

TODO -> We have to use the DOMSubtreeModified event listener to get text changes. The Mutation Observer should be able to handle text changes also. It might be that the CONFIG needs to change or we need to add a second Mutation Observer with a different CONFIG to get those changes. There seems to be some overlap with attributes and characterData where we can't have both. idk. 
*/

export const useEventListeners = () => {
  //* Array of all of the Elements that have event listeners attached to them.
  const [elWithListeners, setElWithListeners] = useState<Array<string>>();

  /** If the DOMSubtreeModified event listener has been added. */
  const isEventListenerOn = useRef(false);

  /** The `MutationObserver` */
  const mutator = useRef<MutationObserver | null>(null);

  /** Array of snapshots of the DOM at that moment */
  const snapshots = useRef<Array<ISnapshot>>([]);

  /** Array of all of the events (onClick, onChange, etc.) that have happened on the DOM. */
  const [events, setEvents] = useState<
    Array<{
      eventType: string;
      event_id: string;
      timestamp: number;
      snapshotId: string;
    }>
  >([]);

  /** Array of all the mutations from the DOM. */
  const [domActions, setDomActions] = useState<Array<any>>([]);

  useOnMount(() => {
    (async () => {
      //* Wait for the DOM to be present before creating listeners on the DOM
      await waitForUUIDToBePresent();
      setElWithListeners(getAllChildrenWithEventListeners());
      snapShotEventListener();
      createMutationObserver();
    })();
  });

  // useLogOnChange(snapshots, "snapshots");
  // useLogOnChange(domActions, "domActions");
  // useLogOnChange(events, "events");

  /**
   * Grabs all of the elements under the #UUID and creates event listeners for everything that already has a React event listener.
   */
  const getAllChildrenWithEventListeners = () => {
    let childArray = [];
    const CHILDREN = Array.from(document.querySelectorAll("#UUID *"));

    for (let i = 0; i < CHILDREN.length; i++) {
      const CURR: any = CHILDREN[i];

      let element = createEventListeners(CURR);
      if (element) {
        childArray.push(element);
      }
    }
    return childArray;
  };

  /**
   * Creates a new snapshot of the DOM and the event that triggered it
   * @param event
   */
  const snapShotEventListener = (event?: any) => {
    const SNAPSHOT_ID = guidGenerator();
    setEvents((oldEvents) => [
      ...oldEvents,
      {
        snapshotId: SNAPSHOT_ID,
        eventType: event?.type || "init",
        event_id: event?.target?.dataset?.event_id || "init",
        timestamp: new Date().getTime(),
      },
    ]);
    snapshots.current.push({
      id: SNAPSHOT_ID,
      timestamp: new Date().getTime(),
      html: document.querySelector("#UUID")!.innerHTML,
    });
  };

  const createEventListeners = (element: any) => {
    if (!element.dataset.event_id) {
      element.dataset.event_id = guidGenerator();
    }

    //* Get the __reactProp key from the element
    const PROP_KEY = Object.keys(element).find((e) =>
      e.startsWith("__reactProps")
    ) as any;

    const PROPS = element[PROP_KEY];
    //* Get all of the event listeners on the prop key
    const EVENT_LISTENERS = Object.keys(PROPS).filter((e) =>
      e.startsWith("on")
    );

    for (let i = 0; i < EVENT_LISTENERS.length; i++) {
      //* Create event listener for ALL of the event listeners on the element.
      const CURR_EVENT = EVENT_LISTENERS[i].toLowerCase();
      element[CURR_EVENT] = snapShotEventListener;
    }
    //* If we have event listeners then add it to the array.
    if (EVENT_LISTENERS.length) {
      return element.dataset.event_id;
    }

    return false;
  };

  const MUTATION_CALLBACK = (
    mutationList: Array<MutationRecord>,
    observer: any
  ) => {
    let addMutations = [];
    let removedMutations = [];
    let attributeMutations = [];
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (Array.from(mutation.addedNodes).length) {
          setElWithListeners(getAllChildrenWithEventListeners());
          addMutations.push(...(Array.from(mutation.addedNodes) as any));
        }

        if (Array.from(mutation.removedNodes).length) {
          removedMutations.push(...(Array.from(mutation.removedNodes) as any));
        }
      } else if (mutation.type === "attributes") {
        //* Ignore the dataset.event_id changes or #UUID changes. We make them.
        let { attributeName, target } = mutation;
        if (
          attributeName === "data-event_id" ||
          (target as any).id === "UUID"
        ) {
          continue;
        }
        attributeMutations.push(mutation as any);
      }
    }

    const TIMESTAMP = new Date().getTime();
    let mutationEvents: Array<any> = [];
    addMutations.forEach((e) =>
      mutationEvents.push({
        event_id: e.dataset.event_id,
        snapshotId: getLastSnapshot().id,
        timestamp: TIMESTAMP,
        type: "add",
      })
    );

    removedMutations.forEach((e) =>
      mutationEvents.push({
        event_id: e.dataset.event_id,
        snapshotId: getLastSnapshot().id,
        timestamp: TIMESTAMP,
        type: "removed",
      })
    );

    attributeMutations.forEach((e) =>
      mutationEvents.push({
        attribute: e.attributeName,
        event_id: e.target.dataset.event_id,
        newValue: getAttributeFromSnapshot(
          document.querySelector("#UUID")!,
          e.target.dataset.event_id,
          e.attributeName
        ),
        prevValue: e.oldValue,
        snapshotId: getLastSnapshot().id,
        timestamp: TIMESTAMP,
        type: "attribute",
      })
    );

    setDomActions((oldDomActions) => [...oldDomActions, ...mutationEvents]);
  };

  const createMutationObserver = () => {
    const TARGET_NODE = document.querySelector("#UUID") as Node;

    const CONFIG: MutationObserverInit = {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
    };
    if (!isEventListenerOn.current) {
      TARGET_NODE.addEventListener("DOMSubtreeModified", (event: any) => {
        console.log("DOMSubtreeModified", event);
        if (event.path[0].nodeName === "#text") {
          setDomActions((oldDomActions) => [
            ...oldDomActions,
            {
              snapshotId: getLastSnapshot().id,
              timestamp: new Date().getTime(),
              type: "attribute",
              attribute: "text",
              event_id: event.path[1].dataset.event_id,
              newValue: event.path[1].textContent,
              prevValue: getAttributeFromSnapshot(
                createDomFromLastSnapshot(),
                event.path[1].dataset.event_id,
                "innerText"
              ),
            },
          ]);
        }
      });

      isEventListenerOn.current = true;
    }
    if (!mutator.current) {
      mutator.current = new MutationObserver(MUTATION_CALLBACK);
      mutator.current.observe(TARGET_NODE, CONFIG);
    }
  };

  /**
   * Returns the last DOM snapshot taken
   */
  const getLastSnapshot = () => snapshots.current[snapshots.current.length - 1];

  /**
   * Returns a HTMLElement from the last DOM snapshot taken.
   * @returns
   */
  const createDomFromLastSnapshot = () =>
    createDOMFromSnapshot(getLastSnapshot());

  return { snapshots, events, domActions };
};

/**
 * Return a HTMLElement from the `snapshot.html`
 * @param snapshot - The snapshot that needs to be created into a HTMLElement
 */
export const createDOMFromSnapshot = (snapshot: {
  timestamp: number;
  html: string;
  id: string;
}) => {
  let div = document.createElement("div");
  div.innerHTML = snapshot.html;

  return div;
};

/**
 * Returns the `attribute` value from the `event_id` Element from the `snapshot`.
 * @param snapshot - The snapshot of the DOM.
 * @param event_id - The `dataset.event_id` to look for of the Element.
 * @param attributeName - The attribute to return the `event_id` Element.
 */
export const getAttributeFromSnapshot = (
  snapshot: HTMLElement,
  event_id: string,
  attributeName: string
) => {
  let selector = snapshot.querySelector(`[data-event_id='${event_id}']`) as any;
  if (selector) {
    //* If the attributeName is style, just return the whole cssText instead of looping through and trying to find the difference in the style object.
    if (attributeName === "style") {
      return selector.style.cssText;
    }
    return selector[attributeName as keyof Element];
  } else {
    return "";
  }
};

/**
 * `console.log` when the `val` has changed from a previous render.
 * @param val -
 * @param name
 */
export const useLogOnChange = (val: any, name?: string) => {
  const prevVal = useRef(val);

  //* If there is a .current then we are dealing with a useRef.
  //* useRef won't call a useEffect on change so we deal with it when the function is called.
  if (val?.current) {
    if (JSON.stringify(prevVal) !== JSON.stringify(val)) {
      console.log(`${name} changed`, val);
      prevVal.current = val.current;
    }
  }
  useEffect(() => {
    if (JSON.stringify(prevVal.current) !== JSON.stringify(val)) {
      console.log(`${name} changed`, val);
      prevVal.current = val;
    }
  }, [val]);
};
