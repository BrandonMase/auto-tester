import { useEffect } from "react";
import { SideBar } from "./Sidebar";
import { getAllChildrenWithEventListeners } from "./utils";

let mutator: MutationObserver;
let isEventListenerOn = false;
export const AutoTest = (props: any) => {
  return (
    <>
      <SideBar />
      <div id="snapshot-render"></div>
      <div id="UUID">{props.children}</div>
    </>
  );
};
