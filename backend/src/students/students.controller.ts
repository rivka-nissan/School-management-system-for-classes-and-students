import { Body, Controller, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { StudentsService } from './students.service';
import type { CreateStudentDto, UpdateStudentDto } from '../types';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }
}
