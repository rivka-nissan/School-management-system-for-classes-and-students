import { DataService } from '../data.service';
import { Student, CreateStudentDto, UpdateStudentDto } from '../types';
export declare class StudentsService {
    private readonly data;
    constructor(data: DataService);
    create(dto: CreateStudentDto): Student;
    update(id: number, dto: UpdateStudentDto): Student;
}
