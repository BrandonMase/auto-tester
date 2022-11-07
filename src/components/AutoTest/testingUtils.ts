import { IMutation, ISnapshot } from "./Sidebar";
import { createDOMFromSnapshot } from "./useEventListener";

export const createTestGet = (
  mutation: IMutation,
  snapshot: HTMLDivElement,
  nextSnapshot: HTMLDivElement
) => {
  //   const DOM = createDOMFromSnapshot(snapshot);
  //   const nextDOM = createDOMFromSnapshot(nextSnapshot);
  let uniqueness;
  uniqueness = getUniqueness(mutation, snapshot, nextSnapshot);

  return uniqueness;
};

let w: any;
w = window;
w.createTestGet = createTestGet;

const getUniqueness = (
  mutation: IMutation,
  DOM: HTMLDivElement,
  nextDOM: HTMLDivElement
) => {
  const LAST_EL = DOM.querySelector(
    `[data-event_id='${mutation.event_id}']`
  ) as HTMLElement;

  const NEXT_EL = nextDOM.querySelector(
    `[data-event_id='${mutation.event_id}']`
  ) as HTMLElement | null;
  const TEXT_NODES = tryTextNodes(mutation, DOM, nextDOM, LAST_EL, NEXT_EL);
  return TEXT_NODES;
};

const tryTextNodes = (
  mutation: IMutation,
  DOM: HTMLDivElement,
  nextDOM: HTMLDivElement,
  element: HTMLElement | null,
  nextElement: HTMLElement | null
) => {
  const LAST_TEXT_NODES: Array<any> | null = element
    ? getChildTextNodes(element)
    : null;
  const NEXT_TEXT_NODES: Array<any> | null = nextElement
    ? getChildTextNodes(nextElement)
    : null;

  switch (mutation.type) {
    case "removed": {
      const TEXT_NODE = textNodesByRemoval(element as HTMLElement, nextDOM);
      if (TEXT_NODE) {
        return TEXT_NODE;
      }
      break;
    }
    case "add": {
      const TEXT_NODE = textNodesByAdd(nextElement as HTMLElement, nextDOM);
      if (TEXT_NODE) {
        return TEXT_NODE;
      }
      break;
    }

    case "attribute": {
      if (mutation.attribute === "text") {
        const TEXT_NODE = textNodesByText(
          mutation,
          nextElement as HTMLElement,
          nextDOM
        );
        if (TEXT_NODE) {
          return TEXT_NODE;
        }
      } else {
        //   getMutationArributeChange(mutation, element, nextElement, nextDOM);
      }
    }
  }
};

const textNodesByText = (
  mutation: IMutation,
  element: HTMLElement,
  nextDOM: HTMLDivElement
) => {
  const REG_EXP_NEW = createTextRegEx(mutation.newValue || "");
  const NEXT_DOM = filterTextElements(REG_EXP_NEW, nextDOM, element);
  const TAG = getElementTagUniqueness(element);
  if (NEXT_DOM.length === 1) {
    return `//* ${TAG} text changed from ${mutation.prevValue} to ${mutation.newValue}. Make sure REGEX: ${REG_EXP_NEW} exists on the DOM.
    expect((await screen.findByText(${REG_EXP_NEW})).textContent).toEqual('${element.textContent}');`;
  } else {
    const EL_INDEX = NEXT_DOM.findIndex(
      (e: any) => e.dataset.event_id === element.dataset.event_id
    );
    return `//* ${TAG} text changed from ${mutation.prevValue} to ${mutation.newValue}.
    //* The ${EL_INDEX} index is the one we need.
    expect((await screen.findAllByText(${REG_EXP_NEW}))[${EL_INDEX}].textContent).toEqual('${element.textContent}')
    `;
  }
};

export const getElementTagUniqueness = (element: HTMLElement) => {
  const TAG_NAME = element.tagName;
  let uniqueness = TAG_NAME ? TAG_NAME.toLowerCase() : "";

  const CLASS_LIST = Array.from(element.classList);
  uniqueness += CLASS_LIST.length ? `.${CLASS_LIST.join(".")}` : "";

  const ID = element.id;
  uniqueness += ID ? `#${ID}` : "";

  const TEST_ID = element.dataset.testid;
  uniqueness += TEST_ID ? `[data-testid='${TEST_ID}']` : "";

  return uniqueness;
};

const textNodesByAdd = (element: HTMLElement, nextDOM: HTMLDivElement) => {
  const LAST_TEXT_NODES: Array<any> = getChildTextNodes(element);

  if (!LAST_TEXT_NODES.length) {
    return false;
  }

  const REG_EXP = createTextRegEx(LAST_TEXT_NODES[0].nodeValue || "");
  const NEXT_DOM = filterTextElements(REG_EXP, nextDOM, element);

  if (NEXT_DOM.length === 1) {
    return `
      //* REGEX: ${REG_EXP} text was added to the DOM. Make sure the element has the correct textContent.
      expect((await screen.findByText(${REG_EXP})).textContent).toEqual('${element.textContent}');`;
  } else {
    const EL_INDEX = NEXT_DOM.findIndex(
      (e: any) => e.dataset.event_id === element.dataset.event_id
    );
    return `//* REGEX: ${REG_EXP} text was added to the DOM. 
    //* There is ${NEXT_DOM.length} of them in the DOM. The ${EL_INDEX} index is the one we are looking for.
    expect((await screen.findAllByText(${REG_EXP}))[${EL_INDEX}].textContent).toEqual('${element.textContent}')`;
  }
};

/**
 * Creates tests for a removal of a element based on the text in the element.
 * @param element - The element that got removed.
 * @param nextDOM - The DOM after the element was removed.
 */
const textNodesByRemoval = (element: HTMLElement, nextDOM: HTMLDivElement) => {
  const LAST_TEXT_NODES: Array<any> = getChildTextNodes(element);

  if (!LAST_TEXT_NODES.length) {
    return false;
  }
  const REG_EXP = createTextRegEx(LAST_TEXT_NODES[0].nodeValue || "");
  const NEXT_DOM = filterTextElements(REG_EXP, nextDOM, element);

  if (NEXT_DOM.length === 0) {
    return `//* REGEX: ${REG_EXP} text removed from DOM. Wait for it to be removed.
    await waitFor(() => expect(screen.queryByText(${REG_EXP})).not.toBeInTheDocument())
    `;
  } else {
    return `//*  REGEX: ${REG_EXP} text was removed from the DOM. Make sure there is only ${NEXT_DOM.length} left in the DOM.
    await waitFor(() => expect(screen.queryAllByText(${REG_EXP}).length).toEqual(${NEXT_DOM.length}))
    `;
  }
};

const filterTextElements = (
  regEx: RegExp,
  DOM: HTMLDivElement,
  element: HTMLElement
) => {
  return Array.from(DOM.querySelectorAll("*")).filter((e) => {
    return Array.from(e.childNodes).some((f) => regEx.test(f.nodeValue || ""));
  });
};

const createTextRegEx = (text: string) => new RegExp(text);

const getChildTextNodes = (element: HTMLElement) =>
  Array.from(element.childNodes as any).filter(
    (e: any) => e.nodeName === "#text"
  );
