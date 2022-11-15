import { useAutoTestContext } from "../../AutoTestContext";
import { MutationDisplay } from "../MutationDisplay/MutationDisplay";
import { MutationReason } from "../MutationReason/MutationReason";
import { IMutationWrapperProps } from "./IMutationWrapperProps.interface";

export const MutationWrapper = (props: IMutationWrapperProps) => {
  const { mutationEvent } = props;
  const { snapshotSelected, setSnapshotSelected } = useAutoTestContext();

  const getBorderColor = () =>
    snapshotSelected?.id === mutationEvent.snapshot.id ? "blue" : "gray";

  return (
    <div
      className="Mutation-Display"
      style={{
        borderColor: getBorderColor(),
      }}
      onClick={() => setSnapshotSelected(mutationEvent.snapshot)}
    >
      <MutationReason
        triggerEvent={mutationEvent.triggerEvent}
        DOM={mutationEvent.DOM as HTMLDivElement}
      />
      {mutationEvent.mutations.map((e,i) => (
      <MutationDisplay
        key={e.event_id}
        mutationEvent={mutationEvent} 
        index={i} 
        />))}
    </div>
  );
};
