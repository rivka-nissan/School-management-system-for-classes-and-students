import { StudentsService } from './students.service';
import type { CreateStudentDto, UpdateStudentDto } from '../types';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(dto: CreateStudentDto): import("../types").Student;
    update(id: number, dto: UpdateStudentDto): import("../types").Student;
}
