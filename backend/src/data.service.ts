import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Class, Student } from './types';

@Injectable()
export class DataService implements OnModuleInit {
  classes: Class[] = [];
  students: Student[] = [];

  onModuleInit() {
    this.classes = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'classes.json'), 'utf-8'),
    );
    this.students = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'students.json'), 'utf-8'),
    );
  }
}
