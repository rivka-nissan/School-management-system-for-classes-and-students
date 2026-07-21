import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Class, Student, CreateStudentDto, UpdateStudentDto, CreateClassDto, UpdateClassDto } from '../types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  tagTypes: ['Classes', 'Students'],
  endpoints: (builder) => ({
    getClasses: builder.query<Class[], void>({
      query: () => '/classes',
      providesTags: ['Classes'],
    }),
    getClass: builder.query<Class, number>({
      query: (id) => `/classes/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Classes', id }],
    }),
    createClass: builder.mutation<Class, CreateClassDto>({
      query: (body) => ({ url: '/classes', method: 'POST', body }),
      invalidatesTags: ['Classes'],
    }),
    updateClass: builder.mutation<Class, { id: number; body: UpdateClassDto }>({
      query: ({ id, body }) => ({ url: `/classes/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Classes'],
    }),
    deleteClass: builder.mutation<void, number>({
      query: (id) => ({ url: `/classes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Classes'],
    }),
    getStudentsByClass: builder.query<Student[], number>({
      query: (classId) => `/classes/${classId}/students`,
      providesTags: (_r, _e, classId) => [{ type: 'Students', id: classId }],
    }),
    createStudent: builder.mutation<Student, CreateStudentDto>({
      query: (body) => ({ url: '/students', method: 'POST', body }),
      invalidatesTags: (_r, _e, arg) => [{ type: 'Students', id: arg.classId }, 'Classes'],
    }),
    updateStudent: builder.mutation<Student, { id: number; body: UpdateStudentDto; classId: number }>({
      query: ({ id, body }) => ({ url: `/students/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, arg) => [{ type: 'Students', id: arg.classId }],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useGetStudentsByClassQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
} = api;
