import { getUniqueIdentifierForElement } from "../../utils";
import { IMutationReasonProps } from "./IMutationReasonProps.interface";

export const MutationReason = (props: IMutationReasonProps) => {
  const { triggerEvent, DOM } = props;

  /**
   * Returns the reason for the rerender.
   */
  const renderEventReason = () => {
    const UNIQUE_ID = getUniqueIdentifierForElement(
      triggerEvent.event_id,
      DOM as HTMLDivElement
    );

    return `${UNIQUE_ID} triggered by ${triggerEvent.eventType}`;
  };

  //* If the event type of init, just say the DOM was initialzied
  //* Else find the reason why the rerender happened.
  if (triggerEvent.eventType === "init") {
    return <h4>DOM was initialized</h4>;
  } else {
    return <h4>{renderEventReason()}</h4>;
  }
};
