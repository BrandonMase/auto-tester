import React, { useState } from "react";
import { useAutoTestContext } from "./AutoTestContext";
import { MutationWrapper } from "./components/MutationWrapper/MutationWrapper";
import "./Sidebar.css";

export const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { mappedState, setSnapshotSelected, snapshotSelected } =
    useAutoTestContext();

  return (
    <>
      {isSidebarOpen && (
        <div className="Sidebar">
          <>
            {Array.from(mappedState.values()).map((e) => {
              return (
                <MutationWrapper
                  key={e.triggerEvent.event_id}
                  mutationEvent={e}
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