import { baseApi } from "../../api/baseApi";

const userPaymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserPayments: build.query({
      query: ({ page = 1, limit = 5, id }) => ({
        url: `/by-user/payment?userId=${id}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data,
        };
      },
      providesTags: ["category"],
    }),
  }),
});

export const { useGetUserPaymentsQuery } = userPaymentApi;
