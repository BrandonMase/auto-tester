import { useEffect, useState } from "react";
import { ISnapshot } from "../interfaces/ISnapshot";

/**
 * A `useHook` to render the snapshot that is chosen on the sidebar.
 */
export const useRenderShapshot = () => {
  const [snapshotSelected, setSnapshotSelected] = useState<ISnapshot | null>(
    null
  );

  useEffect(() => {
    if (snapshotSelected) {
      renderSnapshot(snapshotSelected);
    } else {
      renderUUID();
    }
  }, [snapshotSelected]);

  return { setSnapshotSelected, snapshotSelected };
};

/**
 * Renders the snapshot the is passed in.
 * @param snapshot - The `ISnapshot` to display in the DOM.
 */
export const renderSnapshot = (snapshot: ISnapshot) => {
  const snapshotRender = document.querySelector(
    "#snapshot-render"
  ) as HTMLDivElement;
  snapshotRender.innerHTML = (snapshot as ISnapshot).html as string;
  const UUID = document.querySelector("#UUID") as HTMLElement;
  UUID.style.display = "none";

  createSnapshotAwareDiv();
};

/**
 * Displays the `#UUID` Auto test Element.
 */
const renderUUID = () => {
  const snapshotRender = document.querySelector(
    "#snapshot-render"
  ) as HTMLDivElement;
  snapshotRender.innerHTML = "";
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.querySelector("body")!.style.border = "none";
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.querySelector("body")!.style.minHeight = "initial";
  const UUID = document.querySelector("#UUID") as HTMLElement;
  UUID.style.display = "initial";

  removeSnapshotAwareDiv();
};

/**
 * Creates and Renders the .snapshot-aware div to the body.
 */
const createSnapshotAwareDiv = () => {
  if (document.querySelector(".snapshot-aware")) {
    return;
  }
  const div = document.createElement("div");
  div.classList.add("snapshot-aware");
  div.innerHTML =
    "<span>You are in snapshot mode. Nothing will function.</span>";
  document.querySelector("body")?.appendChild(div);
};

/**
 * Removes the .snapshot-aware div from the dom.
 */
const removeSnapshotAwareDiv = () => {
  const snapshotDiv = document.querySelector(".snapshot-aware") as HTMLDivElement;

  if (snapshotDiv) {
    snapshotDiv.style.animation =
      "snapshot-aware-ani-reverse cubic-bezier(0.075, 0.82, 0.165, 1) forwards 0.3s";
    setTimeout(() => {
      document.querySelector("body")?.removeChild(snapshotDiv);
    }, 200);
  }
};
