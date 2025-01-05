import { baseApi } from "@/redux/api/baseApi";

const sliderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addSlider: build.mutation({
      query: (data) => {
        return {
          url: "/slider/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["slider"],
    }),
    getSliders: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/slider?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["slider"],
    }),
    getAllSliders: build.query({
      query: () => ({
        url: `/slider/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["slider"],
    }),
    getSingleSlider: build.query({
      query: (id) => ({
        url: `/slider/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["slider"],
    }),
    updateSlider: build.mutation({
      query: (payload) => ({
        url: `/slider/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["slider"],
    }),
    deleteSlider: build.mutation({
      query: (id) => ({
        url: `/slider/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["slider"],
    }),
    deleteBulkSlider: build.mutation({
      query: (payload) => {
        return {
          url: `/slider/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["slider"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddSliderMutation,
  useGetSlidersQuery,
  useGetAllSlidersQuery,
  useGetSingleSliderQuery,
  useUpdateSliderMutation,
  useDeleteSliderMutation,
  useDeleteBulkSliderMutation,
} = sliderApi;
