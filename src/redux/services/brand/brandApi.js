import { baseApi } from "@/redux/api/baseApi";

const brandApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addBrand: build.mutation({
      query: (data) => {
        return {
          url: "brand/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["brand"],
    }),
    getBrands: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/brand?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["brand"],
    }),
    getAllBrands: build.query({
      query: () => ({
        url: `/brand/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["brand"],
    }),
    getSingleBrand: build.query({
      query: (id) => ({
        url: `/brand/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["brand"],
    }),
    updateBrand: build.mutation({
      query: (payload) => ({
        url: `/brand/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["brand"],
    }),
    deleteBrand: build.mutation({
      query: (id) => ({
        url: `/brand/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["brand"],
    }),
    deleteBulkBrand: build.mutation({
      query: (payload) => {
        return {
          url: `/brand/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["brand"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddBrandMutation,
  useGetBrandsQuery,
  useGetAllBrandsQuery,
  useGetSingleBrandQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useDeleteBulkBrandMutation,
} = brandApi;
