import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { base_url } from "../../utilities/configs/base_api";

const baseQuery = fetchBaseQuery({
  baseUrl: base_url,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQuery,
  tagTypes: [
    "category",
    "globalSetting",
    "payment",
    "user",
    "attribute",
    "attributeOption",
    "brand",
    "giftCard",
    "coupon",
    "product",
    "offer",
    "wishlist",
    "cart",
    "slider",
    "review",
    "order",
    "compare",
    "newsletter",
  ],
  endpoints: () => ({}),
});
