import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from '../data.service';
import { Class, CreateClassDto, UpdateClassDto } from '../types';

@Injectable()
export class ClassesService {
  constructor(private readonly data: DataService) {}

  findAll(): Class[] {
    return this.data.classes.map((c) => ({
      ...c,
      studentsCount: this.data.students.filter((s) => s.classId === c.id).length,
    }));
  }

  findOne(id: number): Class {
    const cls = this.data.classes.find((c) => c.id === id);
    if (!cls) throw new NotFoundException(`Class ${id} not found`);
    return { ...cls, studentsCount: this.data.students.filter((s) => s.classId === id).length };
  }

  create(dto: CreateClassDto): Class {
    const newClass: Class = {
      id: Math.max(0, ...this.data.classes.map((c) => c.id)) + 1,
      studentsCount: 0,
      ...dto,
    };
    this.data.classes.push(newClass);
    return newClass;
  }

  update(id: number, dto: UpdateClassDto): Class {
    const idx = this.data.classes.findIndex((c) => c.id === id);
    if (idx === -1) throw new NotFoundException(`Class ${id} not found`);
    this.data.classes[idx] = { ...this.data.classes[idx], ...dto };
    return this.findOne(id);
  }

  remove(id: number): void {
    const idx = this.data.classes.findIndex((c) => c.id === id);
    if (idx === -1) throw new NotFoundException(`Class ${id} not found`);
    this.data.classes.splice(idx, 1);
  }

  getStudents(id: number) {
    this.findOne(id);
    return this.data.students.filter((s) => s.classId === id);
  }
}
