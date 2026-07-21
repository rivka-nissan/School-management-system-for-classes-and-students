import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { DataService } from '../data.service';
import { NotFoundException } from '@nestjs/common';

const mockData = {
  classes: [],
  students: [
    { id: 1, classId: 1, identityNumber: '123456782', firstName: 'דוד', lastName: 'כהן', parentPhone: '050', status: 'ACTIVE' as const },
  ],
};

describe('StudentsService', () => {
  let service: StudentsService;
  let dataService: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: DataService, useValue: JSON.parse(JSON.stringify(mockData)) },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    dataService = module.get<DataService>(DataService);
  });

  it('create adds a new student', () => {
    const result = service.create({
      classId: 1, identityNumber: '999999999', firstName: 'חדש', lastName: 'תלמיד', parentPhone: '053', status: 'ACTIVE',
    });
    expect(result.id).toBe(2);
    expect(dataService.students).toHaveLength(2);
  });

  it('update modifies existing student', () => {
    const result = service.update(1, { firstName: 'מעודכן' });
    expect(result.firstName).toBe('מעודכן');
  });

  it('update throws NotFoundException for unknown id', () => {
    expect(() => service.update(999, { firstName: 'x' })).toThrow(NotFoundException);
  });
});
