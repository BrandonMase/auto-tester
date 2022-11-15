import { useRef, useState } from "react";
import "./Child.css";

const list = [1, 2, 3, 4];
export const Child = () => {
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
      <p className={val ? 'withValFalse' : 'withValTrue'} id={val ? 'idWithFalse' : 'idWithTrue'}>woah</p>
      <p className={val ? 'withValFalse' : 'withValTrue'} id={val ? 'idWithFalse' : 'idWithTrue'}>woah</p>
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
