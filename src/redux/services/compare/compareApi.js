import { baseApi } from "@/redux/api/baseApi";

const compareApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addCompare: build.mutation({
      query: (data) => {
        return {
          url: "/compare/",
          method: "POST",
          body: data,
        };
      },

      invalidatesTags: ["compare"],
    }),
    getCompares: build.query({
      query: ({ page = 1, limit = 5 }) => ({
        url: `/compare?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response?.data?.meta,
          results: response?.data?.results,
        };
      },
      providesTags: ["compare"],
    }),
    getAllCompares: build.query({
      query: () => ({
        url: `/compare/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["compare"],
    }),
    getSingleCompare: build.query({
      query: (id) => ({
        url: `/compare/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["compare"],
    }),
    getSingleCompareByUser: build.query({
      query: (id) => ({
        url: `/compare/user/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["compare"],
    }),
    updateCompare: build.mutation({
      query: (payload) => ({
        url: `/compare/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["compare"],
    }),
    deleteCompare: build.mutation({
      query: (id) => ({
        url: `/compare/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["compare"],
    }),
    deleteBulkCompare: build.mutation({
      query: (payload) => {
        return {
          url: `/compare/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["compare"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddCompareMutation,
  useGetComparesQuery,
  useGetAllComparesQuery,
  useGetSingleCompareQuery,
  useGetSingleCompareByUserQuery,
  useUpdateCompareMutation,
  useDeleteCompareMutation,
  useDeleteBulkCompareMutation,
} = compareApi;
