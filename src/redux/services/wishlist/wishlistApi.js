import { baseApi } from "@/redux/api/baseApi";

const wishlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addWishlist: build.mutation({
      query: (data) => {
        return {
          url: "wishlist/",
          method: "POST",
          body: data,
        };
      },

      invalidatesTags: ["wishlist"],
    }),
    getWishlists: build.query({
      query: ({ page = 1, limit = 5 }) => ({
        url: `/wishlist?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response?.data?.meta,
          results: response?.data?.results,
        };
      },
      providesTags: ["wishlist"],
    }),
    getAllWishlists: build.query({
      query: () => ({
        url: `/wishlist/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["wishlist"],
    }),
    getSingleWishlist: build.query({
      query: (id) => ({
        url: `/wishlist/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["wishlist"],
    }),
    getSingleWishlistByUser: build.query({
      query: (id) => ({
        url: `/wishlist/user/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["wishlist"],
    }),
    updateWishlist: build.mutation({
      query: (payload) => ({
        url: `/wishlist/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["wishlist"],
    }),
    deleteWishlist: build.mutation({
      query: (id) => ({
        url: `/wishlist/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["wishlist"],
    }),
    deleteBulkWishlist: build.mutation({
      query: (payload) => {
        return {
          url: `/wishlist/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["wishlist"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddWishlistMutation,
  useGetWishlistsQuery,
  useGetSingleWishlistQuery,
  useGetSingleWishlistByUserQuery,
  useUpdateWishlistMutation,
  useDeleteWishlistMutation,
  useDeleteBulkWishlistMutation,
  useGetAllWishlistsQuery,
} = wishlistApi;
