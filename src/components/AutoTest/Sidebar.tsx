import React, { useEffect, useRef, useState } from "react";
import "./Sidebar.css";
import { createTestGet } from "./testingUtils";
import { createDOMFromSnapshot, useEventListeners } from "./useEventListener";
import { guidGenerator } from "./utils";

export interface ISnapshot {
  id: string;
  html: string;
  timestamp: number;
}

export interface IMutation {
  type: string;
  event_id: string;
  timestamp: number;
  snapshotId: string;
  prevValue?: any;
  newValue?: any;
  attribute?: string;
}

export interface IMappedState {
  triggerEvent: any;
  snapshot: ISnapshot;
  DOM: HTMLDivElement | null;
  nextDOM: HTMLDivElement;
  mutations: Array<IMutation>;
}
export const SideBar = (props: any) => {
  console.log("rerender");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { snapshots, events, domActions } = useEventListeners();
  const [mappedState, setMappedState] = useState(
    new Map<string, IMappedState>()
  );

  const [snapshotSelected, setSnapshotSelected] =
    useState<ISnapshot | null>(null);

  useEffect(() => {
    let newMappedState = new Map();

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
            : document.querySelector("#UUID")!,
        mutations: getDomActionsBySnapshotId(e.snapshotId),
      });
    });
    setMappedState(newMappedState);
  }, [snapshots, events, domActions]);

  useEffect(() => {
    const renderSnapshot = () => {
      let snapshotRender = document.querySelector(
        "#snapshot-render"
      ) as HTMLDivElement;
      snapshotRender.innerHTML = (snapshotSelected as ISnapshot).html as string;
      let UUID = document.querySelector("#UUID") as HTMLElement;
      UUID.style.display = "none";

      if (!document.querySelector(".snapshot-aware")) {
        let div = document.createElement("div");
        div.classList.add("snapshot-aware");
        div.innerHTML =
          "<span>You are in snapshot mode. Nothing will function.</span>";
        document.querySelector("body")!.appendChild(div);
      }
    };

    const renderUUID = () => {
      let snapshotRender = document.querySelector(
        "#snapshot-render"
      ) as HTMLDivElement;
      snapshotRender.innerHTML = "";
      document.querySelector("body")!.style.border = "none";
      document.querySelector("body")!.style.minHeight = "initial";
      let UUID = document.querySelector("#UUID") as HTMLElement;
      UUID.style.display = "initial";

      let snapshotDiv = document.querySelector(
        ".snapshot-aware"
      ) as HTMLDivElement;

      if (snapshotDiv) {
        snapshotDiv.style.animation =
          "snapshot-aware-ani-reverse cubic-bezier(0.075, 0.82, 0.165, 1) forwards 0.3s";
        setTimeout(() => {
          document.querySelector("body")!.removeChild(snapshotDiv);
        }, 200);
      }
    };

    if (snapshotSelected) {
      renderSnapshot();
    } else {
      renderUUID();
    }
  }, [snapshotSelected]);

  const getSnapshotById = (id: string) =>
    snapshots.current.find((e) => e.id === id);

  const getDomActionsBySnapshotId = (id: string) =>
    domActions.filter((e) => e.snapshotId === id);

  return (
    <>
      {isSidebarOpen && (
        <div className="Sidebar">
          <>
            {Array.from(mappedState.values()).map((e, i, arr) => {
              return (
                <MutationDisplay
                  key={e.snapshot.id}
                  value={e}
                  setSnapshotSelected={setSnapshotSelected}
                  snapshotSelected={snapshotSelected}
                  nextSnapshot={arr[i + 1] ? arr[i + 1].snapshot : null}
                />
              );
            })}
            <div
              style={{
                borderColor: !snapshotSelected ? "blue" : "gray",
              }}
              className="Mutation-Display"
              onClick={() => setSnapshotSelected(null)}
            >
              <h4>Current DOM</h4>
            </div>
          </>
        </div>
      )}
      <div
        className="sidebar-open"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ right: isSidebarOpen ? "calc(33% + 25px)" : "10px" }}
      >
        <div>{isSidebarOpen ? "-" : "+"}</div>
      </div>
    </>
  );
};

export interface IMutationDisplayProps {
  value: IMappedState;
  setSnapshotSelected: React.Dispatch<React.SetStateAction<ISnapshot | null>>;
  snapshotSelected: ISnapshot | null;
  nextSnapshot: ISnapshot | null;
}

let w: any;
w = window;
w.testing = [];
w.getTesting = () => {
  console.log("test output", ...w.testing);
};
export const MutationDisplay = React.memo((props: IMutationDisplayProps) => {
  const { value, setSnapshotSelected, snapshotSelected, nextSnapshot } = props;
  const findElementOnDOMByEventId = (event_id: string): HTMLElement =>
    value.DOM!.querySelector(`[data-event_id='${event_id}']`) as HTMLDivElement;

  const findElementOnNextDOMByEventId = (event_id: string): HTMLElement =>
    value.nextDOM!.querySelector(
      `[data-event_id='${event_id}']`
    ) as HTMLDivElement;

  const renderEventReason = () => {
    let element = findElementOnDOMByEventId(value.triggerEvent.event_id);

    let uniqueId = element.tagName.toLowerCase();

    if (element.classList.value) {
      uniqueId += "." + Array.from(element.classList).join(".");
    }

    if (element.id) {
      uniqueId += "#" + element.id;
    }

    return `${uniqueId} triggered by ${value.triggerEvent.eventType}`;
  };

  const getMutationSentence = (mutation: IMutation) => {
    let uniqueId = "";

    let element = findElementOnNextDOMByEventId(mutation.event_id);

    if (mutation.type === "removed") {
      element = findElementOnDOMByEventId(mutation.event_id);
    }

    if (element) {
      uniqueId = element.tagName.toLowerCase();

      if (element.classList.value) {
        uniqueId += "." + Array.from(element.classList).join(".");
      }

      if (element.id) {
        uniqueId += "#" + element.id;
      }
    }

    let el;

    switch (mutation.type) {
      case "removed": {
        el = (
          <p>
            <strong>{uniqueId}</strong> was removed from DOM
          </p>
        );
        break;
      }
      case "add": {
        el = (
          <p>
            <strong>{uniqueId}</strong> was added to the DOM
          </p>
        );
        break;
      }
      case "attribute": {
        el = (
          <p>
            <strong>
              {uniqueId} {mutation.attribute}
            </strong>{" "}
            was changed from <strong>{mutation.prevValue}</strong> to{" "}
            <strong>{mutation.newValue}</strong>
          </p>
        );
        break;
      }
    }
    w.testing.push(
      createTestGet(
        mutation,
        value.DOM as HTMLDivElement,
        value.nextDOM === null
          ? document.querySelector("#UUID")!
          : value.nextDOM
      ) + "\n\n"
    );
    return el;
  };

  return (
    <div
      className="Mutation-Display"
      style={{
        borderColor:
          snapshotSelected?.id === value.snapshot.id ? "blue" : "gray",
      }}
    >
      <button onClick={() => setSnapshotSelected(value.snapshot)}>
        Before
      </button>
      <button onClick={() => setSnapshotSelected(nextSnapshot)}>After</button>
      {value.triggerEvent.eventType === "init" && <h4>DOM was initialized</h4>}
      {value.triggerEvent.eventType !== "init" && (
        <h4>{renderEventReason()}</h4>
      )}
      {value.mutations.map((e) => (
        <div>
          <span>{getMutationSentence(e)}</span>
        </div>
      ))}
    </div>
  );
});

export const useOnMount = (cb: any) => {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!isLoaded.current) {
      cb();
    }
    return () => {
      isLoaded.current = true;
    };
  }, []);
};

/**
 * Resolves after the #UUID Element is present on the DOM.
 */
export const waitForUUIDToBePresent = async (): Promise<true> => {
  return new Promise((resolve) => {
    let interval: any;

    interval = setInterval(() => {
      let doc = document.querySelectorAll("#UUID");
      if (doc) {
        resolve(true);
      }

      clearInterval(interval);
    }, 10);
  });
};

/**
 * Creates a snapshot of what is currently in the DOM.
 */
const createInnerHTML = (innerHTML: string) => {
  let div = document.createElement("div");
  div.innerHTML = innerHTML;
  return div.children;
};
