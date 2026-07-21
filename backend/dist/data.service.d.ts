import { OnModuleInit } from '@nestjs/common';
import { Class, Student } from './types';
export declare class DataService implements OnModuleInit {
    classes: Class[];
    students: Student[];
    onModuleInit(): void;
}
