import { baseApi } from "@/redux/api/baseApi";

const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addCart: build.mutation({
      query: (data) => {
        return {
          url: "/cart/",
          method: "POST",
          body: data,
        };
      },

      invalidatesTags: ["cart"],
    }),
    getCarts: build.query({
      query: ({ page = 1, limit = 5 }) => ({
        url: `/cart?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response?.data?.meta,
          results: response?.data?.results,
        };
      },
      providesTags: ["cart"],
    }),
    getAllCarts: build.query({
      query: () => ({
        url: `/cart/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["cart"],
    }),
    getSingleCart: build.query({
      query: (id) => ({
        url: `/cart/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["cart"],
    }),
    getSingleCartByUser: build.query({
      query: (id) => ({
        url: `/cart/user/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["cart"],
    }),
    updateCart: build.mutation({
      query: (payload) => ({
        url: `/cart/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["cart"],
    }),
    deleteCart: build.mutation({
      query: (id) => ({
        url: `/cart/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["cart"],
    }),
    deleteBulkCart: build.mutation({
      query: (payload) => {
        return {
          url: `/cart/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["cart"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddCartMutation,
  useGetCartsQuery,
  useGetAllCartsQuery,
  useGetSingleCartQuery,
  useGetSingleCartByUserQuery,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useDeleteBulkCartMutation,
} = cartApi;
