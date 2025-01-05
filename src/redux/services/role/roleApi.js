import { jwtDecode } from "jwt-decode";
import { baseApi } from "../../api/baseApi";

const roleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addRole: build.mutation({
      query: (data) => {
        return {
          url: "/roles/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["roles"],
    }),
    getRoles: build.query({
      query: ({ page }) => ({
        url: `/roles/?limit=10&offset=${(page - 1) * 10}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const resData = jwtDecode(response.data.results.token);
        return { response: response.data.meta, data: resData.data };
      },
      providesTags: ["roles"],
    }),
    getAllRoles: build.query({
      query: () => ({
        url: `/roles/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const resData = jwtDecode(response.data.results.token);
        return { data: resData.data };
      },
      providesTags: ["roles"],
    }),
    getSingleRole: build.query({
      query: (id) => ({
        url: `/roles/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const resData = jwtDecode(response.data.results.token);
        return resData;
      },
      providesTags: ["roles"],
    }),
    updateRole: build.mutation({
      query: (payload) => ({
        url: `/roles/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["roles"],
    }),
    deleteRole: build.mutation({
      query: (id) => ({
        url: `/roles/${id}/soft_delete/`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["roles"],
    }),
  }),
});

export const {
  useAddRoleMutation,
  useGetAllRolesQuery,
  useGetRolesQuery,
  useGetSingleRoleQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
