export interface Class {
  id: number;
  name: string;
  grade: string;
  homeroomTeacher: string;
  studentsCount: number;
}

export interface Student {
  id: number;
  classId: number;
  identityNumber: string;
  firstName: string;
  lastName: string;
  parentPhone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export type CreateStudentDto = Omit<Student, 'id'>;
export type UpdateStudentDto = Partial<Omit<Student, 'id'>>;
export type CreateClassDto = Omit<Class, 'id' | 'studentsCount'>;
export type UpdateClassDto = Partial<CreateClassDto>;
