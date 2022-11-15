import { IMutation } from "./interfaces/IMutation";
import { tryTextNodes } from "./testingUtils/textNodes";

export const createTestGet = (
  mutation: IMutation,
  snapshot: HTMLDivElement,
  nextSnapshot: HTMLDivElement
) => {

  return getExpectForMutation(mutation, snapshot, nextSnapshot);
};

/**
 * Returns a except statement for a given mutation.
 * @param mutation - The mutation to get the expect statement for.
 * @param DOM - The `DOM` before the mutation happened.
 * @param nextDOM - The `DOM` after the mutation happened.
 */
const getExpectForMutation = (
  mutation: IMutation,
  DOM: HTMLDivElement,
  nextDOM: HTMLDivElement
) => {

  const TEXT_NODES = tryTextNodes(mutation, DOM, nextDOM);
  return TEXT_NODES;
};


/**
 * Return an element's uniqueness
 * @param element - The element we need to find the uniqueness on.
 */
export const getElementTagUniqueness = (element: HTMLElement) => {
  const TAG_NAME = element.tagName;
  let uniqueness = TAG_NAME ? TAG_NAME.toLowerCase() : "";

  //* Get the element's classList if it exists
  const CLASS_LIST = Array.from(element.classList);
  uniqueness += (CLASS_LIST.length > 0) ? `.${CLASS_LIST.join(".")}` : "";

    //* Get the element's id if it exists
  const ID = element.id;
  uniqueness += ID ? `#${ID}` : "";

    //* Get the element's dataset.testid if it exists
  const TEST_ID = element.dataset.testid;
  uniqueness += TEST_ID ? `[data-testid='${TEST_ID}']` : "";

  return uniqueness;
};


