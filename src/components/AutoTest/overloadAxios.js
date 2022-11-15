/* eslint-disable no-undef */
import axios from "axios";

export const overloadAxios = () => {
  window.overloadedAxios = [];
  localStorage.setItem(
    "overloadedAxios",
    JSON.stringify(window.overloadedAxios)
  );
  let _get = axios.get;
  let _post = axios.post;
  let _put = axios.put;
  let _patch = axios.patch;
  let _delete = axios.delete;
  axios.get = async (...args) => fakeAxios(_get, "get", ...args);
  axios.post = async (...args) => fakeAxios(_post, "post", ...args);
  axios.put = async (...args) => fakeAxios(_put, "put", ...args);
  axios.patch = async (...args) => fakeAxios(_patch, "patch", ...args);
  axios.delete = async (...args) => fakeAxios(_delete, "delete", ...args);
};

const fakeAxios = (method, callType, ...args) => {
  return new Promise((resolve, reject) => {
    method(...args)
      .then((res) => {
        window.overloadedAxios.push({
          callArgs: args,
          callType,
          type: "resolve",
          response: res,
        });
        localStorage.setItem(
          "overloadedAxios",
          JSON.stringify(window.overloadedAxios)
        );
        resolve(res);
      })
      .catch((err) => {
        window.overloadedAxios.push({
          callArgs: args,
          callType,
          type: "reject",
          response: err,
        });
        localStorage.setItem(
          "overloadedAxios",
          JSON.stringify(window.overloadedAxios)
        );
        reject(err);
      });
  });
};

export const MockAxios = (mockData) => {
  if (window.overloadedAxios) {
    throw new Error(
      `Can't use overloadAxios and MockAxios at the same time. Remove one.`
    );
  }
  axios.get = (...args) => mockedCall(mockData, "get", ...args);
  axios.post = (...args) => mockedCall(mockData, "post", ...args);
  axios.put = (...args) => mockedCall(mockData, "put", ...args);
  axios.patch = (...args) => mockedCall(mockData, "patch", ...args);
  axios.delete = (...args) => mockedCall(mockData, "delete", ...args);
};

const mockedCall = (mockData, callType, ...args) => {
  let index = mockData.findIndex(
    (e) => JSON.stringify(e.callArgs) === JSON.stringify(args)
  );

  if (index !== -1) {
    let { response, type } = mockData.splice(index, 1)[0];
    if (type === "resolve") {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  }

  console.error("Erroring on this axios call", `type: ${callType}`, ...args);
  console.error(new Error().stack);
  throw new Error(`Can't find data for mocked axios`);
};
