import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { DataService } from '../data.service';
import { NotFoundException } from '@nestjs/common';

const mockData = {
  classes: [
    { id: 1, name: 'כיתה א1', grade: 'א', homeroomTeacher: 'שרה כהן', studentsCount: 2 },
    { id: 2, name: 'כיתה ב1', grade: 'ב', homeroomTeacher: 'רחל לוי', studentsCount: 1 },
  ],
  students: [
    { id: 1, classId: 1, identityNumber: '123456782', firstName: 'דוד', lastName: 'כהן', parentPhone: '050', status: 'ACTIVE' as const },
    { id: 2, classId: 1, identityNumber: '123456790', firstName: 'משה', lastName: 'לוי', parentPhone: '051', status: 'INACTIVE' as const },
    { id: 3, classId: 2, identityNumber: '223456781', firstName: 'יעקב', lastName: 'רוזן', parentPhone: '052', status: 'ACTIVE' as const },
  ],
};

describe('ClassesService', () => {
  let service: ClassesService;
  let dataService: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        { provide: DataService, useValue: JSON.parse(JSON.stringify(mockData)) },
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
    dataService = module.get<DataService>(DataService);
  });

  it('findAll returns classes with correct studentsCount', () => {
    const result = service.findAll();
    expect(result).toHaveLength(2);
    expect(result[0].studentsCount).toBe(2);
    expect(result[1].studentsCount).toBe(1);
  });

  it('findOne returns correct class', () => {
    const result = service.findOne(1);
    expect(result.name).toBe('כיתה א1');
  });

  it('findOne throws NotFoundException for unknown id', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });

  it('create adds a new class', () => {
    const result = service.create({ name: 'כיתה ג1', grade: 'ג', homeroomTeacher: 'מרים' });
    expect(result.id).toBe(3);
    expect(dataService.classes).toHaveLength(3);
  });

  it('update modifies existing class', () => {
    const result = service.update(1, { name: 'כיתה א1 מעודכן' });
    expect(result.name).toBe('כיתה א1 מעודכן');
  });

  it('remove deletes class', () => {
    service.remove(1);
    expect(dataService.classes).toHaveLength(1);
  });

  it('getStudents returns students for class', () => {
    const result = service.getStudents(1);
    expect(result).toHaveLength(2);
  });
});
