import { baseApi } from "@/redux/api/baseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addCoupon: build.mutation({
      query: (data) => {
        return {
          url: "/coupon/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["coupon"],
    }),
    getCoupons: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/coupon?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["coupon"],
    }),
    getAllCoupons: build.query({
      query: () => ({
        url: `/coupon/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["coupon"],
    }),
    getSingleCoupon: build.query({
      query: (id) => ({
        url: `/coupon/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["coupon"],
    }),
    getSingleCouponByCode: build.query({
      query: (code) => ({
        url: `/coupon/code/${code}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["coupon"],
    }),
    updateCoupon: build.mutation({
      query: (payload) => ({
        url: `/coupon/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["coupon"],
    }),
    deleteCoupon: build.mutation({
      query: (id) => ({
        url: `/coupon/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["coupon"],
    }),
    deleteBulkCoupon: build.mutation({
      query: (payload) => {
        return {
          url: `/coupon/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["coupon"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddCouponMutation,
  useGetCouponsQuery,
  useGetAllCouponsQuery,
  useGetSingleCouponQuery,
  useGetSingleCouponByCodeQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useDeleteBulkCouponMutation,
} = couponApi;
