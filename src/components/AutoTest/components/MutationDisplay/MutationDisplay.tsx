import { useAutoTestContext } from "../../AutoTestContext";
import { MUTATION_EVENTS } from "../../interfaces/IMutation";
import { getUniqueIdentifierForElement } from "../../utils";
import { IMutationDisplayProps } from "./IMutationDisplayProps.interface";
import { getMutationReason } from "./utils/getMutationReason";

export const MutationDisplay = (props: IMutationDisplayProps) => {
  const {mutationEvent, index} = props;
  const CURR_MUTATION = mutationEvent.mutations[index];

  const {snapshotSelected} = useAutoTestContext();

  const getMutationSentence = () => {
    let uniqueId = '';

    if(CURR_MUTATION.type === MUTATION_EVENTS.REMOVED) {
      uniqueId = getUniqueIdentifierForElement(CURR_MUTATION.event_id, mutationEvent.DOM as HTMLDivElement);
    }
    else {
      uniqueId = getUniqueIdentifierForElement(CURR_MUTATION.event_id, mutationEvent.nextDOM as HTMLDivElement);
    }

    return getMutationReason(CURR_MUTATION, uniqueId);
  };
    const highlightCurrentEventId = () => {
      const el = getElementFromDocument();
    if(!el) {
      return;
    }
     el.style.outline = 'solid 2px red';

    }

    const getElementFromDocument = () => {
       let el: HTMLElement;
      const EVENT_ID = `[data-event_id="${CURR_MUTATION.event_id}"]`;

      if(snapshotSelected) {
        el = document.querySelector('#snapshot-render')?.querySelector(EVENT_ID) as HTMLElement
        return el;
      }

      return false;
      

    }
    
   const stopHightlightCurrentEventId = () => {
    const el = getElementFromDocument();
    if(!el) {
      return;
    }
     el.style.outline = '';
    }
  return (<div onMouseEnter={() => highlightCurrentEventId()} onMouseLeave={() => stopHightlightCurrentEventId()}>
    <span>{getMutationSentence()}</span>
  </div>)
}
