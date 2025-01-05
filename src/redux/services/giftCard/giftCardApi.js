import { baseApi } from "@/redux/api/baseApi";

const giftCardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addGiftCard: build.mutation({
      query: (data) => {
        return {
          url: "/gift-card/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["giftCard"],
    }),
    getGiftCards: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/gift-card?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["giftCard"],
    }),
    getAllGiftCards: build.query({
      query: () => ({
        url: `/gift-card/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["giftCard"],
    }),
    getSingleGiftCard: build.query({
      query: (id) => ({
        url: `/gift-card/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["giftCard"],
    }),
    getSingleGiftCardByCode: build.query({
      query: (code) => ({
        url: `/gift-card/code/${code}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["giftCard"],
    }),
    updateGiftCard: build.mutation({
      query: (payload) => ({
        url: `/gift-card/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["giftCard"],
    }),
    deleteGiftCard: build.mutation({
      query: (id) => ({
        url: `/gift-card/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["giftCard"],
    }),
    deleteBulkGiftCard: build.mutation({
      query: (payload) => {
        return {
          url: `/gift-card/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["giftCard"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddGiftCardMutation,
  useGetGiftCardsQuery,
  useGetAllGiftCardsQuery,
  useGetSingleGiftCardQuery,
  useGetSingleGiftCardByCodeQuery,
  useUpdateGiftCardMutation,
  useDeleteGiftCardMutation,
  useDeleteBulkGiftCardMutation,
} = giftCardApi;
