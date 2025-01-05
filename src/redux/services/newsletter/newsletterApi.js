import { baseApi } from "@/redux/api/baseApi";

const newsletterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addNewsletter: build.mutation({
      query: (data) => {
        return {
          url: "/newsletter/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["newsletter"],
    }),
    getNewsletters: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/newsletter?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["newsletter"],
    }),
    getAllNewsletters: build.query({
      query: () => ({
        url: `/newsletter/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["newsletter"],
    }),
    getSingleNewsletter: build.query({
      query: (id) => ({
        url: `/newsletter/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["newsletter"],
    }),
    updateNewsletter: build.mutation({
      query: (payload) => ({
        url: `/newsletter/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["newsletter"],
    }),
    deleteNewsletter: build.mutation({
      query: (id) => ({
        url: `/newsletter/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["newsletter"],
    }),
    deleteBulkNewsletter: build.mutation({
      query: (payload) => {
        return {
          url: `/newsletter/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["newsletter"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddNewsletterMutation,
  useGetNewslettersQuery,
  useGetAllNewslettersQuery,
  useGetSingleNewsletterQuery,
  useUpdateNewsletterMutation,
  useDeleteNewsletterMutation,
  useDeleteBulkNewsletterMutation,
} = newsletterApi;
