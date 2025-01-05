import { baseApi } from "@/redux/api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addProduct: build.mutation({
      query: (data) => {
        return {
          url: "product/",
          method: "POST",
          body: data,
        };
      },

      invalidatesTags: ["product"],
    }),
    getProducts: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/product?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response?.data?.meta,
          results: response?.data?.results,
        };
      },
      providesTags: ["product"],
    }),
    getAllProducts: build.query({
      query: () => ({
        url: `/product/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["product"],
    }),
    getSingleProduct: build.query({
      query: (id) => ({
        url: `/product/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["product"],
    }),
    getSingleProductBySku: build.query({
      query: (sku) => ({
        url: `/product/sku/${sku}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["product"],
    }),
    getSingleProductBySlug: build.query({
      query: (slug) => ({
        url: `/product/slug/${slug}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["product"],
    }),
    updateProduct: build.mutation({
      query: (payload) => ({
        url: `/product/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/product/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["product"],
    }),
    deleteBulkProduct: build.mutation({
      query: (payload) => {
        return {
          url: `/product/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["product"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddProductMutation,
  useGetProductsQuery,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useGetSingleProductBySkuQuery,
  useGetSingleProductBySlugQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteBulkProductMutation,
} = productApi;
