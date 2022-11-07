import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { AutoTest } from "./components/AutoTest/AutoTest";
import { Child } from "./components/Child/Child";
// import axios from "axios";
import { overloadAxios, MockAxios } from "./components/AutoTest/overloadAxios";
// overloadAxios();
// MockAxios([
//   {
//     callArgs: ["https://randomuser.me/api/", { headers: { Test: "hi" } }],
//     callType: "get",
//     type: "resolve",
//     response: {
//       data: {
//         results: [
//           {
//             gender: "male",
//             name: { title: "Mr", first: "Jackson", last: "Wilson" },
//             location: {
//               street: { number: 6726, name: "Taradale Road" },
//               city: "Whanganui",
//               state: "Canterbury",
//               country: "New Zealand",
//               postcode: 36824,
//               coordinates: { latitude: "52.3380", longitude: "-48.4545" },
//               timezone: {
//                 offset: "+5:30",
//                 description: "Bombay, Calcutta, Madras, New Delhi",
//               },
//             },
//             email: "jackson.wilson@example.com",
//             login: {
//               uuid: "7ebade24-f24a-4cc2-8cca-2d66a066b598",
//               username: "silverostrich248",
//               password: "rommel",
//               salt: "0lqNVUhH",
//               md5: "e73fa0a61bed65eaa5d82baed1bd6ff3",
//               sha1: "df173bdfa0f846276be707cca947ad2f7a3ccd4a",
//               sha256:
//                 "e522d83625fb3abf5529ce975c52acd63ca3fe2d63c4a6477af2874607e7793e",
//             },
//             dob: { date: "1993-06-26T20:40:24.907Z", age: 29 },
//             registered: { date: "2010-07-24T12:23:17.941Z", age: 12 },
//             phone: "(604)-373-6536",
//             cell: "(390)-041-2652",
//             id: { name: "", value: null },
//             picture: {
//               large: "https://randomuser.me/api/portraits/men/37.jpg",
//               medium: "https://randomuser.me/api/portraits/med/men/37.jpg",
//               thumbnail: "https://randomuser.me/api/portraits/thumb/men/37.jpg",
//             },
//             nat: "NZ",
//           },
//         ],
//         info: { seed: "82899901333e39bb", results: 1, page: 1, version: "1.4" },
//       },
//       status: 200,
//       statusText: "",
//       headers: {
//         "cache-control": "no-cache",
//         "content-type": "application/json; charset=utf-8",
//       },
//       config: {
//         transitional: {
//           silentJSONParsing: true,
//           forcedJSONParsing: true,
//           clarifyTimeoutError: false,
//         },
//         transformRequest: [null],
//         transformResponse: [null],
//         timeout: 0,
//         xsrfCookieName: "XSRF-TOKEN",
//         xsrfHeaderName: "X-XSRF-TOKEN",
//         maxContentLength: -1,
//         maxBodyLength: -1,
//         env: {},
//         headers: { Accept: "application/json, text/plain, */*", Test: "hi" },
//         method: "get",
//         url: "https://randomuser.me/api/",
//       },
//       request: {},
//     },
//   },
//   {
//     callArgs: ["https://randomuser.me/api/", { headers: { Test: "hi" } }],
//     callType: "get",
//     type: "resolve",
//     response: {
//       data: {
//         results: [
//           {
//             gender: "male",
//             name: { title: "Mr", first: "Norman", last: "Lewis" },
//             location: {
//               street: { number: 5116, name: "Bridge Road" },
//               city: "Truro",
//               state: "West Yorkshire",
//               country: "United Kingdom",
//               postcode: "JX2D 8SA",
//               coordinates: { latitude: "-6.8668", longitude: "-36.0760" },
//               timezone: {
//                 offset: "-12:00",
//                 description: "Eniwetok, Kwajalein",
//               },
//             },
//             email: "norman.lewis@example.com",
//             login: {
//               uuid: "b8081ef7-8df3-4fa0-b388-1cbdd0c3934f",
//               username: "orangelion164",
//               password: "calvin",
//               salt: "G17o0Qd7",
//               md5: "f4b2e969c466073bf4852a732ae0f1af",
//               sha1: "0dfaff04197c31d96efd24e9b2c3c12fecf70922",
//               sha256:
//                 "fd73116ae8d6552c9cda5651ac7e988dfb297f294b1fadb0446f87d40d95b52f",
//             },
//             dob: { date: "1990-06-13T22:18:18.761Z", age: 32 },
//             registered: { date: "2016-04-26T09:12:53.607Z", age: 6 },
//             phone: "01807 26229",
//             cell: "07459 836283",
//             id: { name: "NINO", value: "HW 52 23 50 E" },
//             picture: {
//               large: "https://randomuser.me/api/portraits/men/83.jpg",
//               medium: "https://randomuser.me/api/portraits/med/men/83.jpg",
//               thumbnail: "https://randomuser.me/api/portraits/thumb/men/83.jpg",
//             },
//             nat: "GB",
//           },
//         ],
//         info: { seed: "3272d75afb4db946", results: 1, page: 1, version: "1.4" },
//       },
//       status: 200,
//       statusText: "",
//       headers: {
//         "cache-control": "no-cache",
//         "content-type": "application/json; charset=utf-8",
//       },
//       config: {
//         transitional: {
//           silentJSONParsing: true,
//           forcedJSONParsing: true,
//           clarifyTimeoutError: false,
//         },
//         transformRequest: [null],
//         transformResponse: [null],
//         timeout: 0,
//         xsrfCookieName: "XSRF-TOKEN",
//         xsrfHeaderName: "X-XSRF-TOKEN",
//         maxContentLength: -1,
//         maxBodyLength: -1,
//         env: {},
//         headers: { Accept: "application/json, text/plain, */*", Test: "hi" },
//         method: "get",
//         url: "https://randomuser.me/api/",
//       },
//       request: {},
//     },
//   },
// ]);
function App() {
  // useEffect(() => {
  //   axios
  //     .get("https://randomuser.me/api/", { headers: { Test: "hi" } })
  //     .then((res) => console.log("axios returnbed", res));
  // }, []);
  return (
    <AutoTest>
      <Child />
    </AutoTest>
  );
}

const start = (func: string) => {
  // console.log(func);
  console.clear();
  console.log(new AutoHookTester(func));
};

export class AutoHookTester {
  functionName: string = "";
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
    let newFunc = [];

    //* Loop through each line of the function
    for (let line of this.splitFunction) {
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
