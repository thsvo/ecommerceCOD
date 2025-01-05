import { baseApi } from "@/redux/api/baseApi";

const offerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addOffer: build.mutation({
      query: (data) => {
        return {
          url: "/offer/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["offer"],
    }),
    getOffers: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/offer?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["offer"],
    }),
    getAllOffers: build.query({
      query: () => ({
        url: `/offer/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["offer"],
    }),
    getSingleOffer: build.query({
      query: (id) => ({
        url: `/Offer/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["offer"],
    }),
    updateOffer: build.mutation({
      query: (payload) => ({
        url: `/offer/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["offer"],
    }),
    deleteOffer: build.mutation({
      query: (id) => ({
        url: `/offer/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["offer"],
    }),
    deleteBulkOffer: build.mutation({
      query: (payload) => {
        return {
          url: `/offer/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["offer"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddOfferMutation,
  useGetOffersQuery,
  useGetAllOffersQuery,
  useGetSingleOfferQuery,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useDeleteBulkOfferMutation,
} = offerApi;
