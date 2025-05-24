// src/redux/apiSlice.js
import React from 'react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',  // nombre del slice
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',  // ajusta la URL según tu backend Laravel
    prepareHeaders: (headers) => {
      // si usas autenticación, aquí puedes pasar token con headers
        const token = localStorage.getItem('token'); // asegúrate de definir esto
         if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        }
      return headers;
    }
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ['Users'],
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...user }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = apiSlice;
