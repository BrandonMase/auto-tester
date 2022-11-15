import { AutoTestProvider } from "./AutoTestContext";
import { SideBar } from "./Sidebar";

export const AutoTest = (props: {children: JSX.Element}) => {
  return (
    <>
      <AutoTestProvider>
        <SideBar />
      </AutoTestProvider>
      <div id="snapshot-render"></div>
      <div id="UUID">{props.children}</div>
    </>
  );
};
