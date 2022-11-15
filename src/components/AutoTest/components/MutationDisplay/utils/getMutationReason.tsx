import { IMutation, MUTATION_EVENTS } from "../../../interfaces/IMutation";

export const getMutationReason = (mutation: IMutation, uniqueId:string) => {
  let el;
  switch (mutation.type) {
    case MUTATION_EVENTS.REMOVED: {
      el = (
        <p>
            <strong>{uniqueId}</strong> was removed from DOM
          </p>
        );
        break;
      }
      case MUTATION_EVENTS.ADDED: {
        el = (
          <p>
            <strong>{uniqueId}</strong> was added to the DOM
          </p>
        );
        break;
      }
      case MUTATION_EVENTS.ATTRIBUTE: {
      
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

    return el;
}