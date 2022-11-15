import { IMutation, IMutationAttribute, MUTATION_EVENTS } from "../interfaces/IMutation";
import { getElementTagUniqueness } from "../testingUtils";

/**
 * Try to get a mutation's expect statement by the text from the element.
 * @param mutation 
 * @param DOM 
 * @param nextDOM 
 * @returns 
 */
export const tryTextNodes = (
  mutation: IMutation,
  DOM: HTMLDivElement,
  nextDOM: HTMLDivElement,
) => {
    const element = DOM.querySelector(
    `[data-event_id='${mutation.event_id}']`
  ) as HTMLElement;

  const nextElement = nextDOM.querySelector(
    `[data-event_id='${mutation.event_id}']`
  ) as HTMLElement | null;
  
  switch (mutation.type) {
    case MUTATION_EVENTS.REMOVED: 
      return textNodesByRemoval(element as HTMLElement, nextDOM);
    
    case MUTATION_EVENTS.ADDED:
      return textNodesByAdd(nextElement as HTMLElement, nextDOM);

    case MUTATION_EVENTS.ATTRIBUTE: {
      if (mutation.attribute === "text") {
        return textNodesByText(
          mutation,
          nextElement as HTMLElement,
          nextDOM
        );
      } else {
        return textNodesByAttributeChange(mutation as IMutationAttribute, nextElement as HTMLElement, nextDOM);
      }
    }

    default:
      return false;
  }
};

/**
 * Get all of the elements from the `nextDOM` that has the same `mutation.attribute` === `mutation.newValue`
 * @param mutation - The mutation to look for.
 * @param nextDOM - The `DOM` to look into.
 */
const filterElementsByAttribute = (mutation: IMutationAttribute, nextDOM: HTMLDivElement) => {
  
  switch(mutation.attribute) {
    case 'style':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Array.from(nextDOM.childNodes as any).filter((e:any) => e.style.cssText === mutation.newValue) as Array<HTMLElement>;

      case 'class':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Array.from(nextDOM.childNodes as any).filter((e:any) => e.classList.value === mutation.newValue)  as Array<HTMLElement>;

      default: 
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       return Array.from(nextDOM.childNodes as any).filter((e:any) => e[mutation.attribute] === mutation.newValue)  as Array<HTMLElement>;
  }
}

/**
 * Returns the key for the given attribute from a `HTMLElement`
 * @param attribute - The attribute to look for.
 */
const getAttributeForExpect = (attribute:string) => {
  switch(attribute) {
    case 'style':
      return 'style.cssText';
    case 'class':
      return 'classList.value';
    default:
      return attribute;
  }
}

/**
 *  Creates a mutation's expect statement (based on text) when the mutation was a attribute change.
 * @param mutation - The mutation to look at. 
 * @param element - The element that the mutation happened on after the change.
 * @param nextDOM - The snapshot of the `DOM` after the change happened.
 */
const textNodesByAttributeChange = (
  mutation: IMutationAttribute,
  element: HTMLElement,
  nextDOM: HTMLDivElement
) => {
  const REG_EXP_NEW = createTextRegEx(element.textContent || "");
  const NEXT_DOM = filterTextElements(REG_EXP_NEW, nextDOM);
  const TAG = getElementTagUniqueness(element);
  const ATTR = getAttributeForExpect(mutation.attribute);

  if(NEXT_DOM.length === 0) {
    return false;
  }

  if(NEXT_DOM.length === 1) {
    return `//* ${TAG} ${mutation.attribute} changed from ${mutation.prevValue} to ${mutation.newValue}. Make sure the ${mutation.attribute} has changed.
    //* Make sure REGEX: ${REG_EXP_NEW} exists on the DOM.
    expect((await screen.findByText(${REG_EXP_NEW})).${ATTR}).toEqual('${mutation.newValue}');`;
  }
  else {
        const EL_INDEX = NEXT_DOM.findIndex(
      (e: HTMLElement) => e.dataset.event_id === element.dataset.event_id
    );
     return `//* ${TAG} ${ATTR} changed from ${mutation.prevValue} to ${mutation.newValue}.
    //* The ${EL_INDEX} index is the one we need.
    expect((await screen.findAllByText(${REG_EXP_NEW}))[${EL_INDEX}].${ATTR}).toEqual('${mutation.newValue}')`
  }


}

/**
 * Creates a mutation's expect statement (based on text) when the mutation was a text change.
 * @param mutation - The mutation to look at. 
 * @param element - The element that the mutation happened on after the change.
 * @param nextDOM - The snapshot of the `DOM` after the change happened.
 */
const textNodesByText = (
  mutation: IMutation,
  element: HTMLElement,
  nextDOM: HTMLDivElement
) => {
  const REG_EXP_NEW = createTextRegEx(mutation.newValue || "");
  const NEXT_DOM = filterTextElements(REG_EXP_NEW, nextDOM);
  const TAG = getElementTagUniqueness(element);
  if(NEXT_DOM.length === 0) {
    return false;
  }
  if (NEXT_DOM.length === 1) {
    return `//* ${TAG} text changed from ${mutation.prevValue} to ${mutation.newValue}. Make sure REGEX: ${REG_EXP_NEW} exists on the DOM.
    expect((await screen.findByText(${REG_EXP_NEW})).textContent).toEqual('${element.textContent}');`;
  } else {
    const EL_INDEX = NEXT_DOM.findIndex(
      (e: HTMLElement) => e.dataset.event_id === element.dataset.event_id
    );
    return `//* ${TAG} text changed from ${mutation.prevValue} to ${mutation.newValue}.
    //* The ${EL_INDEX} index is the one we need.
    expect((await screen.findAllByText(${REG_EXP_NEW}))[${EL_INDEX}].textContent).toEqual('${element.textContent}')
    `;
  }
};

/**
 * Creates a mutation's expect statement (based on text) when the mutation was the element was added to the `DOM`.
 * @param element - The element that the mutation happened on after the change.
 * @param nextDOM - The snapshot of the `DOM` after the change happened.
 */
const textNodesByAdd = (element: HTMLElement, nextDOM: HTMLDivElement) => {
  const LAST_TEXT_NODES = getChildTextNodes(element);

  if (LAST_TEXT_NODES.length === 0) {
    return false;
  }

  const REG_EXP = createTextRegEx(LAST_TEXT_NODES[0].nodeValue || "");
  const NEXT_DOM = filterTextElements(REG_EXP, nextDOM);

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
 * Creates a mutation's expect statement (based on text) when the mutation was the element was removed from the `DOM`.
 * @param element - The element that the mutation happened on before the change.
 * @param nextDOM - The snapshot of the `DOM` after the change happened.
 */
const textNodesByRemoval = (element: HTMLElement, nextDOM: HTMLDivElement) => {
  const LAST_TEXT_NODES = getChildTextNodes(element);

  if (LAST_TEXT_NODES.length === 0) {
    return false;
  }
  const REG_EXP = createTextRegEx(LAST_TEXT_NODES[0].nodeValue || "");
  const NEXT_DOM = filterTextElements(REG_EXP, nextDOM);

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

/**
 * Returns all of the element from the `DOM` that has the same text nodes.
 * @param regEx - The `RegExp` of the text to look for. 
 * @param DOM - The `DOM` to grab the elements from.
 */
const filterTextElements = (
  regEx: RegExp,
  DOM: HTMLDivElement,
) => {
  return Array.from(DOM.querySelectorAll("*")).filter((e) => {
    return Array.from(e.childNodes).some((f) => regEx.test(f.nodeValue || ""));
  }) as Array<HTMLElement>;
};

/**
 * Creates a `RegExp` based on the passed in text.
 * @param text - The text to base the `RegExp` on.
 */
const createTextRegEx = (text: string) => new RegExp(text);

/**
 * Get all of the `text` nodes from an element.
 * @param element - The element to look for text nodes on.
 */
const getChildTextNodes = (element: HTMLElement) =>
  Array.from(element.childNodes).filter(
    (e) => e.nodeName === "#text"
  );