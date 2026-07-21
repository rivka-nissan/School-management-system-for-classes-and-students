import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from '../data.service';
import { Student, CreateStudentDto, UpdateStudentDto } from '../types';

@Injectable()
export class StudentsService {
  constructor(private readonly data: DataService) {}

  create(dto: CreateStudentDto): Student {
    const newStudent: Student = {
      id: Math.max(0, ...this.data.students.map((s) => s.id)) + 1,
      ...dto,
    };
    this.data.students.push(newStudent);
    return newStudent;
  }

  update(id: number, dto: UpdateStudentDto): Student {
    const idx = this.data.students.findIndex((s) => s.id === id);
    if (idx === -1) throw new NotFoundException(`Student ${id} not found`);
    this.data.students[idx] = { ...this.data.students[idx], ...dto };
    return this.data.students[idx];
  }
}
