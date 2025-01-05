import { baseApi } from "@/redux/api/baseApi";

const attributeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addAttribute: build.mutation({
      query: (data) => {
        return {
          url: "/attribute/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["attribute"],
    }),
    getAttributes: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/attribute?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["attribute"],
    }),
    getAllAttributes: build.query({
      query: () => ({
        url: `/attribute/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["attribute"],
    }),
    getSingleAttribute: build.query({
      query: (id) => ({
        url: `/attribute/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["attribute"],
    }),
    updateAttribute: build.mutation({
      query: (payload) => ({
        url: `/attribute/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["attribute"],
    }),
    deleteAttribute: build.mutation({
      query: (id) => ({
        url: `/attribute/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["attribute"],
    }),
    deleteBulkAttribute: build.mutation({
      query: (payload) => {
        return {
          url: `/attribute/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["attribute"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddAttributeMutation,
  useGetAttributesQuery,
  useGetAllAttributesQuery,
  useGetSingleAttributeQuery,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useDeleteBulkAttributeMutation,
} = attributeApi;
