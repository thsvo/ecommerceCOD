import { baseApi } from "@/redux/api/baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addOrder: build.mutation({
      query: (data) => {
        return {
          url: "/order/initiate/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["order"],
    }),
    getOrders: build.query({
      query: ({ page = 1, limit = 5 }) => ({
        url: `/order?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["order"],
    }),
    getOrdersByUser: build.query({
      query: ({ page = 1, limit = 5, id }) => ({
        url: `/order/user/${id}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["order"],
    }),
    getAllOrders: build.query({
      query: () => ({
        url: `/order/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["order"],
    }),
    getSingleOrder: build.query({
      query: (id) => ({
        url: `/order/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["order"],
    }),
    getSingleOrderByCode: build.query({
      query: (code) => ({
        url: `/order/code/${code}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["order"],
    }),
    updateOrder: build.mutation({
      query: (payload) => ({
        url: `/order/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["order"],
    }),
    deleteOrder: build.mutation({
      query: (id) => ({
        url: `/order/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["order"],
    }),
    deleteBulkOrder: build.mutation({
      query: (payload) => {
        return {
          url: `/order/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["order"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddOrderMutation,
  useGetOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrdersByUserQuery,
  useGetSingleOrderQuery,
  useGetSingleOrderByCodeQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useDeleteBulkOrderMutation,
} = orderApi;
