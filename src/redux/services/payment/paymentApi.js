import { baseApi } from "@/redux/api/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPayments: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/payment?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data.results,
        };
      },
      providesTags: ["payment"],
    }),
    getAllPayments: build.query({
      query: () => ({
        url: `/payment/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data };
      },
      providesTags: ["payment"],
    }),
    getSinglePayment: build.query({
      query: (id) => ({
        url: `/payment/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["payment"],
    }),
    updatePaymentStatus: build.mutation({
      query: (payload) => {
        return {
          url: `/payment/manual/update-status/${payload.id}/`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["payment"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllPaymentsQuery,
  useGetSinglePaymentQuery,
  useGetPaymentsQuery,
  useUpdatePaymentStatusMutation,
} = paymentApi;
