import { baseApi } from "@/redux/api/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addCategory: build.mutation({
      query: (data) => {
        return {
          url: "/category/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["category"],
    }),
    getCategories: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/category?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["category"],
    }),
    getAllCategories: build.query({
      query: () => ({
        url: `/category/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["category"],
    }),
    getSingleCategory: build.query({
      query: (id) => ({
        url: `/category/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["category"],
    }),
    updateCategory: build.mutation({
      query: (payload) => ({
        url: `/category/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["category"],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/category/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["category"],
    }),
    deleteBulkCategory: build.mutation({
      query: (payload) => {
        return {
          url: `/category/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["category"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteBulkCategoryMutation,
} = categoryApi;
