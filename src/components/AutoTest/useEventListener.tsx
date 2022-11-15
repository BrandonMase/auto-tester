import { useRef, useState } from "react";
import { IMutation, MUTATION_EVENTS } from "./interfaces/IMutation";
import { ISnapshot } from "./interfaces/ISnapshot";
import { ITriggerEvent } from "./interfaces/ITriggerEvent";
import { useOnMount } from "./useHooks/useOnMount";
import { guidGenerator, waitForUUIDToBePresent } from "./utils";

export const useEventListeners = () => {
  //* Array of all of the Elements that have event listeners attached to them.
  const [, setElWithListeners] = useState<Array<string>>();

  /** If the DOMSubtreeModified event listener has been added. */
  const isEventListenerOn = useRef(false);

  /** The `MutationObserver` */
  const mutator = useRef<MutationObserver | null>(null);

  /** Array of snapshots of the DOM at that moment */
  const snapshots = useRef<Array<ISnapshot>>([]);

  /** Array of all of the events (onClick, onChange, etc.) that have happened on the DOM. */
  const [events, setEvents] = useState<Array<ITriggerEvent>>([]);

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
    const childArray = [];
    const CHILDREN = Array.from(document.querySelectorAll("#UUID *"));

    for (let i = 0; i < CHILDREN.length; i++) {
      const CURR: any = CHILDREN[i];

      const element = createEventListeners(CURR);
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    //TODO -> Probably add a check to see if the actual value of the key is a function
    const EVENT_LISTENERS = Object.keys(PROPS).filter((e) =>
      e.startsWith("on")
    );

    for (let i = 0; i < EVENT_LISTENERS.length; i++) {
      //* Create event listener for ALL of the event listeners on the element.
      const CURR_EVENT = EVENT_LISTENERS[i].toLowerCase();
      element[CURR_EVENT] = snapShotEventListener;
    }
    //* If we have event listeners then add it to the array.
    if (EVENT_LISTENERS.length > 0) {
      return element.dataset.event_id;
    }

    return false;
  };

  const MUTATION_CALLBACK = (
    mutationList: Array<MutationRecord>,
    observer: any
  ) => {
    const addMutations = [];
    const removedMutations = [];
    const attributeMutations = [];
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (Array.from(mutation.addedNodes).length > 0) {
          setElWithListeners(getAllChildrenWithEventListeners());
          addMutations.push(...(Array.from(mutation.addedNodes) as any));
        }

        if (Array.from(mutation.removedNodes).length > 0) {
          removedMutations.push(...(Array.from(mutation.removedNodes) as any));
        }
      } else if (mutation.type === "attributes") {
        //* Ignore the dataset.event_id changes or #UUID changes. We make them.
        const { attributeName, target, oldValue,  } = mutation;
        if (
          attributeName === "data-event_id" ||
          (target as any).id === "UUID" ||
          (attributeName === 'style' && (oldValue as string).includes('outline: red solid 2px;'))
        ) {
          continue;
        }
        attributeMutations.push(mutation as any);
      }
    }

    const TIMESTAMP = new Date().getTime();
    const mutationEvents: Array<IMutation> = [];
    addMutations.forEach((e) =>
      mutationEvents.push({
        event_id: e.dataset.event_id,
        snapshotId: getLastSnapshot().id,
        timestamp: TIMESTAMP,
        type: MUTATION_EVENTS.ADDED,
      })
    );

    removedMutations.forEach((e) =>
      mutationEvents.push({
        event_id: e.dataset.event_id,
        snapshotId: getLastSnapshot().id,
        timestamp: TIMESTAMP,
        type: MUTATION_EVENTS.REMOVED,
      })
    );

    attributeMutations.forEach((e) =>
      mutationEvents.push({
        attribute: e.attributeName,
        event_id: e.target.dataset.event_id,
        newValue: getAttributeFromSnapshot(
          document.querySelector("#UUID") as HTMLDivElement,
          e.target.dataset.event_id,
          e.attributeName
        ),
        prevValue: e.oldValue,
        snapshotId: getLastSnapshot().id,
        timestamp: TIMESTAMP,
        type: MUTATION_EVENTS.ATTRIBUTE,
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
        if (event.path[0].nodeName === "#text") {
          setDomActions((oldDomActions) => [
            ...oldDomActions,
            {
              snapshotId: getLastSnapshot().id,
              timestamp: new Date().getTime(),
              type: MUTATION_EVENTS.ATTRIBUTE,
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
  const div = document.createElement("div");
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
  const selector = snapshot.querySelector(`[data-event_id='${event_id}']`) as any;
  if (selector) {
    switch(attributeName) {
      case 'style':
         return selector.style.cssText;
      case 'class':
        return selector.classList.value;

      default:
        return selector[attributeName as keyof Element];

    }

  } else {
    return "";
  }
};
