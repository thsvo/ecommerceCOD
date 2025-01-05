import { baseApi } from "@/redux/api/baseApi";

const attributeOptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addAttributeOption: build.mutation({
      query: (data) => {
        return {
          url: "/attribute-option/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["attributeOption"],
    }),
    getAttributeOptions: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/attribute-option?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["attributeOption"],
    }),
    getAllAttributeOptions: build.query({
      query: () => ({
        url: `/attribute-option/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["attributeOption"],
    }),
    getSingleAttributeOption: build.query({
      query: (id) => ({
        url: `/attribute-option/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["attributeOption"],
    }),
    updateAttributeOption: build.mutation({
      query: (payload) => ({
        url: `/attribute-option/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["attributeOption"],
    }),
    deleteAttributeOption: build.mutation({
      query: (id) => ({
        url: `/attribute-option/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["attributeOption"],
    }),
    deleteBulkAttributeOption: build.mutation({
      query: (payload) => {
        return {
          url: `/attribute-option/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["attributeOption"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddAttributeOptionMutation,
  useGetAttributeOptionsQuery,
  useGetAllAttributeOptionsQuery,
  useGetSingleAttributeOptionQuery,
  useUpdateAttributeOptionMutation,
  useDeleteAttributeOptionMutation,
  useDeleteBulkAttributeOptionMutation,
} = attributeOptionApi;
