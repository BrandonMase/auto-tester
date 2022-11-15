import "./App.css";
import { AutoTest } from "./components/AutoTest/AutoTest";
import { Child } from "./components/Child/Child";

function App() {
  return (
    <AutoTest>
      <Child />
    </AutoTest>
  );
}


export class AutoHookTester {
  functionName = "";
  splitFunction: Array<string>;
  hookArgumentList: Array<Array<string>> = [[]];
  constructor(public func: string) {
    this.splitFunction = this.func.split("\n");
    this.removeWhiteSpace();
    this.getFunctionName();
    this.getArgumentList();
  }

  /**
   * Remove whitespace from a function
   * @param func The function broken up into an array split by a new line
   */
  removeWhiteSpace = () => {
    const newFunc = [];

    //* Loop through each line of the function
    for (const line of this.splitFunction) {
      //* If the line is empty ignore it.
      if (!line.trim()) {
        continue;
      }

      //* Trim the whitespace on the begining and end of the line
      newFunc.push(line.trim());
    }

    //* return the new arrayed function
    this.splitFunction = newFunc;
  };

  /**
   * Gets the function name
   * @param func The whole entire function as a string
   */
  public getFunctionName() {
    const FIRST_LINE = this.splitFunction[0];
    this.functionName = FIRST_LINE.substring(
      FIRST_LINE.indexOf("use"),
      FIRST_LINE.indexOf("=")
    ).trim();
  }

  public getArgumentList = () => {
    const FIRST_P = this.func.indexOf("(") + 1;
    let LAST_P = 0;

    let counter = 1;
    for (let i = FIRST_P; i < this.func.length; i++) {
      const CURR = this.func[i];
      if (CURR === "(") {
        counter += 1;
      }

      if (CURR === ")") {
        counter -= 1;
      }

      if (counter === 0) {
        LAST_P = i;
        break;
      }
    }

    if (LAST_P === 0) {
      throw Error("AutoHookTester -> getArgumentList: Can't find LAST_P");
    }
    this.hookArgumentList = this.func
      .substring(FIRST_P, LAST_P)
      .replaceAll("\n", " ")
      .replace(/\s+/gi, " ")
      .split(",")
      .map((e) => e.split(":").map((f) => f.trim()));
  };
}

export default App;
