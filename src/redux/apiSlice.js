import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const VITE_BE_URL = import.meta.env.VITE_BE_URL;

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: VITE_BE_URL }),
    tagTypes: ["Form"],
    endpoints: (builder) => ({
        getForms: builder.query({
            query: ({ endpoint = '', authToken = '' }) => {
                return {
                  url: `${endpoint}`,
                  headers: {
                    'Authorization': `Bearer ${authToken}`
                  },
                };
              },
            providesTags: ["Form"]
        }),
        
        postApi: builder.mutation({
            query: ({ endpoint = "", body = {}, authToken = '' }) => ({
              url: `${endpoint}`,
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
              },
              body,
            }),
          }),
    }),
})

export const { useGetFormsQuery, useLazyGetFormsQuery, useUpdataByIdMutation, usePostApiMutation } = api