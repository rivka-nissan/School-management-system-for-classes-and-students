import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { DataService } from '../data.service';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, DataService],
})
export class StudentsModule {}
