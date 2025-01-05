import { baseApi } from "@/redux/api/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminDashboard: build.query({
      query: () => ({
        url: `/dashboard/admin/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data };
      },
    }),
    getSingleUserDashboard: build.query({
      query: (id) => ({
        url: `/dashboard/user/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetAdminDashboardQuery, useGetSingleUserDashboardQuery } =
  dashboardApi;
