import { isCompositeComponent } from "react-dom/test-utils";

export const guidGenerator = () => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
};

export const waitForUUIDToBePresent = async () => {
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

// /**
//  * Creates a snapshot of what is currently in the DOM.
//  */
// export const createSnapshot = () => {
//   let tester = document.querySelector("#UUID")!.innerHTML;
//   let div = document.createElement("div");
//   div.innerHTML = tester;
//   const SNAPSHOT = div.children;
//   console.log("snapshot", SNAPSHOT);
// };

// /**
//  * The event listener callback.
//  * @param event
//  */
// export const eventListenerCallback = (event: any) => {
//   createSnapshot();
// };

/**
 * Grabs all of the elements under the #UUID and creates event listeners for everything that already has a React event listener.
 */
export const getAllChildrenWithEventListeners = (eventListener: any) => {
  let childArray = [];
  const CHILDREN = Array.from(document.querySelectorAll("#UUID *"));

  for (let i = 0; i < CHILDREN.length; i++) {
    const CURR: any = CHILDREN[i];

    let element = createEventListeners(CURR, eventListener);
    if (element) {
      // console.log("element", element);
      childArray.push(element);
    }
  }
  return childArray;
};

const createEventListeners = (element: any, eventListener: any) => {
  if (!element.dataset.event_id) {
    element.dataset.event_id = guidGenerator();
  }

  //* Get the __reactProp key from the element
  const PROP_KEY = Object.keys(element).find((e) =>
    e.startsWith("__reactProps")
  ) as any;

  const PROPS = element[PROP_KEY];
  //* Get all of the event listeners on the prop key
  const EVENT_LISTENERS = Object.keys(PROPS).filter((e) => e.startsWith("on"));
  // console.log("props", PROPS);
  for (let i = 0; i < EVENT_LISTENERS.length; i++) {
    //* Create event listener for ALL of the event listeners on the element.
    const CURR_EVENT = EVENT_LISTENERS[i].toLowerCase();
    if (!element[CURR_EVENT]) {
      element[CURR_EVENT] = eventListener;
      console.log(eventListener + "");
    }
  }
  //* If we have event listeners then add it to the array.
  if (EVENT_LISTENERS.length) {
    return element.dataset.event_id;
  }

  return false;
};

export const removeAllEventListeners = (element: any, eventListener: any) => {
  //* Get the __reactProp key from the element
  const PROP_KEY = Object.keys(element).find((e) =>
    e.startsWith("__reactProps")
  ) as any;

  const PROPS = element[PROP_KEY];

  if (!PROPS) {
    return;
  }
  //* Get all of the event listeners on the prop key
  const EVENT_LISTENERS = Object.keys(PROPS).filter((e) => e.startsWith("on"));

  for (let i = 0; i < EVENT_LISTENERS.length; i++) {
    //* Create event listener for ALL of the event listeners on the element.
    const CURR_EVENT = EVENT_LISTENERS[i].toLowerCase();
    element.removeEventListener(CURR_EVENT, eventListener);
  }
};
