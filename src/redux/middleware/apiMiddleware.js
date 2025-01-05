import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { store } from "../store";

const dynamicBaseQuery = async (args, api, extraOptions) => {
  const state = store.getState();
  const apiUrl = state.envApi.apiUrl || "";
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });
  return rawBaseQuery(args, api, extraOptions);
};

export default dynamicBaseQuery;
