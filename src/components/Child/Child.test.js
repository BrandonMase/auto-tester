import { Child } from "./Child";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";

describe("Child Test", () => {
  it("should find button", async () => {
    render(<Child />);

    // const button = await screen.getAllByText(/Click for alert/i)[0];
    // console.log("button", button);
    fireEvent.click(screen.getAllByText(/Click for alert/i)[0]);

    //* p.withValFalse#idWithFalse classList.value changed from withValTrue to withValFalse.
    //* The 1 index is the one we need.
    expect((await screen.findAllByText(/woah/))[1].classList.value).toEqual('withValFalse')
  });
});
