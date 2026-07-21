import { DataService } from '../data.service';
import { Class, CreateClassDto, UpdateClassDto } from '../types';
export declare class ClassesService {
    private readonly data;
    constructor(data: DataService);
    findAll(): Class[];
    findOne(id: number): Class;
    create(dto: CreateClassDto): Class;
    update(id: number, dto: UpdateClassDto): Class;
    remove(id: number): void;
    getStudents(id: number): import("../types").Student[];
}
