import { baseApi } from "@/redux/api/baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addReview: build.mutation({
      query: (data) => {
        return {
          url: "/review/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["review"],
    }),
    getReviews: build.query({
      query: ({ page = 1, limit = 5 }) => ({
        url: `/review?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["review"],
    }),
    getAllReviews: build.query({
      query: () => ({
        url: `/review/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["review"],
    }),
    getSingleReview: build.query({
      query: (id) => ({
        url: `/review/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["review"],
    }),
    getSingleReviewByUser: build.query({
      query: (id) => ({
        url: `/review/user/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["review"],
    }),
    updateReview: build.mutation({
      query: (payload) => ({
        url: `/review/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["review"],
    }),
    deleteReview: build.mutation({
      query: (id) => ({
        url: `/review/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["review"],
    }),
    deleteBulkReview: build.mutation({
      query: (payload) => {
        return {
          url: `/review/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["review"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddReviewMutation,
  useGetReviewsQuery,
  useGetAllReviewsQuery,
  useGetSingleReviewByUserQuery,
  useGetSingleReviewQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useDeleteBulkReviewMutation,
} = reviewApi;
