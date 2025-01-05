import { baseApi } from "@/redux/api/baseApi";

const globalSettingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllGlobalSetting: build.query({
      query: () => ({
        url: `/global-setting/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.result };
      },
      providesTags: ["globalSetting"],
    }),

    updateGlobalSetting: build.mutation({
      query: (payload) => ({
        url: `/global-setting/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["globalSetting"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAllGlobalSettingQuery, useUpdateGlobalSettingMutation } =
  globalSettingApi;
