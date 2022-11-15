/**
 * Creates a random UUID.
 */
export const guidGenerator = () => {
  const S4 = function () {
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

/**
 * Resolves true when when `#UUID` is present on the dom`
 */
export const waitForUUIDToBePresent = async () => {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = undefined

    interval = setInterval(() => {
      const doc = document.querySelectorAll("#UUID");
      if (doc) {
        resolve(true);
      }

      clearInterval(interval);
    }, 10);
  });
};

/**
 * Returns the `__reactProps` key on a given element.
 * @param element - The element we need to find the prop key on.
 */
export const getReactPropKey = (element: HTMLElement): string =>
  Object.keys(element).find((e) => e.startsWith("__reactProps")) as string;

/**
 * Grabs all of the elements under the #UUID and creates event listeners for everything that already has a React event listener.
 */
export const getAllChildrenWithEventListeners = (eventListener: () => void) => {
  const childArray = [];
  const CHILDREN = Array.from(document.querySelectorAll("#UUID *"));

  for (let i = 0; i < CHILDREN.length; i++) {
    const CURR: Element = CHILDREN[i];

    const element = createEventListeners(CURR, eventListener);
    if (element) {
      childArray.push(element);
    }
  }
  return childArray;
};

/**
 * Creates a `dataset.event_id` and adds an event listener to any events on the element.
 * @param element - The element we need to add the listeners to.
 * @param eventListener - The event listener to add.
 * @returns - The `dataset.event_id` if there was listeners or `false` if there were no listeners.
 */
const createEventListeners = (
  element: any,
  eventListener: any
): string | false => {
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

  for (let i = 0; i < EVENT_LISTENERS.length; i++) {
    //* Create event listener for ALL of the event listeners on the element.
    const CURR_EVENT = EVENT_LISTENERS[i].toLowerCase();
    if (!element[CURR_EVENT]) {
      element[CURR_EVENT] = eventListener;
    }
  }
  //* If we have event listeners then add it to the array.
  if (EVENT_LISTENERS.length > 0) {
    return element.dataset.event_id;
  }

  return false;
};

/**
 * Removes all of the event listeners for a given element.
 * @param element
 * @param eventListener
 * @returns
 */
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

/**
 * Returns the element from the `DOM` based on the `event_id`.
 * @param event_id - The `dataset.event_id` to look for on the DOM.
 * @param DOM - The `DOM` to look into.
 */
export const findElementOnDOMByEventId = (
  event_id: string,
  DOM: HTMLDivElement
) => DOM.querySelector(`[data-event_id='${event_id}']`) as HTMLDivElement;

/**
 * Returns the unique identifer of the `element`.
 * @param element - The element we need to find the uniqueness of.
 */
export const getUniqueIdentifier = (element: HTMLElement) => {
  let uniqueId = element.tagName.toLowerCase();

  if (element.classList.value) {
    uniqueId += "." + Array.from(element.classList).join(".");
  }

  if (element.id) {
    uniqueId += "#" + element.id;
  }

  if (element.dataset.testid) {
    uniqueId += `[data-testid="${element.dataset.testid}"]`;
  }

  //TODO Add check for array of elements.

  return uniqueId;
};

/**
 * Returns the unique indentifer of the passed in `event_id` element from the `DOM`.
 * @param event_id - The `dataset.event_id` we need to find the uniqueness of.
 * @param DOM - The `DOM` to look into.
 */
export const getUniqueIdentifierForElement = (
  event_id: string,
  DOM: HTMLDivElement
) => {
  const element = findElementOnDOMByEventId(event_id, DOM as HTMLDivElement);

  return getUniqueIdentifier(element);
};
