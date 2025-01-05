import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signUp: build.mutation({
      query: (userInfo) => ({
        url: "/auth/register/",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),
    login: build.mutation({
      query: (userInfo) => ({
        url: "/auth/login/",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),
    changePassword: build.mutation({
      query: (payload) => ({
        url: "/auth/change-password/",
        method: "POST",
        body: payload.data,
      }),
      invalidatesTags: ["user"],
    }),
    getUsers: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/auth/user?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["user"],
    }),
    getAllUsers: build.query({
      query: () => ({
        url: `/auth/user/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["user"],
    }),
    getSingleUser: build.query({
      query: (id) => ({
        url: `/auth/user/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["user"],
    }),
    updateUserStatus: build.mutation({
      query: (payload) => ({
        url: `/auth/user/status/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["user"],
    }),
    updateUserRole: build.mutation({
      query: (payload) => ({
        url: `/auth/user/role/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["user"],
    }),
    updateUser: build.mutation({
      query: (payload) => ({
        url: `/auth/user/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useGetUsersQuery,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useUpdateUserMutation,
  useChangePasswordMutation,
} = authApi;
