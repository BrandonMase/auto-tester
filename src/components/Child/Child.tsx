import { useRef, useState } from "react";
import "./Child.css";

let list = [1, 2, 3, 4];
export const Child = (props: any) => {
  const [val, setVal] = useState(false);
  const listIndex = useRef(0);
  return (
    <div className="Child">
      {val && (
        <div className="alert">
          ALERT!<strong>what</strong>
          <span>This is something else</span>
        </div>
      )}
      {/* <div className="alert">ALERT!</div> */}
      {!val && <p>This is always here</p>}
      <p>This is always here</p>
      <span className="class-type" id="unqqee" data-testid="teeessstt">
        {list[listIndex.current]}
      </span>
      <span>2</span>
      <input />
      <button
        className="alert-button"
        onClick={() => {
          setVal(!val);
          listIndex.current += 1;
        }}
      >
        Click for alert
      </button>
      <button
        className="alert-button"
        onClick={() => {
          setVal(!val);
          listIndex.current += 1;
        }}
      >
        Click for alert
      </button>
    </div>
  );
};
