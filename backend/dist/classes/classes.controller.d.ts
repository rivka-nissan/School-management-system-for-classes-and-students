import { ClassesService } from './classes.service';
import type { CreateClassDto, UpdateClassDto } from '../types';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    findAll(): import("../types").Class[];
    findOne(id: number): import("../types").Class;
    getStudents(id: number): import("../types").Student[];
    create(dto: CreateClassDto): import("../types").Class;
    update(id: number, dto: UpdateClassDto): import("../types").Class;
    remove(id: number): void;
}
