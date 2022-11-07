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

    //* span.class-type#unqqee[data-testid='teeessstt'] text changed from 1 to 2.
    //* The 0 index is the one we need.
    expect((await screen.findAllByText(/2/))[0].textContent).toEqual("2");

    //* REGEX: /ALERT!/ text was added to the DOM. Make sure the element has the correct textContent.
    expect((await screen.findByText(/ALERT!/)).textContent).toEqual(
      "ALERT!whatThis is something else"
    );

    //*  REGEX: /This is always here/ text was removed from the DOM. Make sure there is only 1 left in the DOM.
    await waitFor(() =>
      expect(screen.queryAllByText(/This is always here/).length).toEqual(1)
    );

    //* span.class-type#unqqee[data-testid='teeessstt'] text changed from 1 to 2.
    //* The 0 index is the one we need.
    expect((await screen.findAllByText(/2/))[0].textContent).toEqual("2");

    //* REGEX: /ALERT!/ text was added to the DOM. Make sure the element has the correct textContent.
    expect((await screen.findByText(/ALERT!/)).textContent).toEqual(
      "ALERT!whatThis is something else"
    );

    //*  REGEX: /This is always here/ text was removed from the DOM. Make sure there is only 1 left in the DOM.
    await waitFor(() =>
      expect(screen.queryAllByText(/This is always here/).length).toEqual(1)
    );

    //* span.class-type#unqqee[data-testid='teeessstt'] text changed from 1 to 2.
    //* The 0 index is the one we need.
    expect((await screen.findAllByText(/2/))[0].textContent).toEqual("2");

    //* REGEX: /ALERT!/ text was added to the DOM. Make sure the element has the correct textContent.
    expect((await screen.findByText(/ALERT!/)).textContent).toEqual(
      "ALERT!whatThis is something else"
    );

    //*  REGEX: /This is always here/ text was removed from the DOM. Make sure there is only 1 left in the DOM.
    await waitFor(() =>
      expect(screen.queryAllByText(/This is always here/).length).toEqual(1)
    );
  });
});
