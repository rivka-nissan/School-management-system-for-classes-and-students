import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { DataService } from '../data.service';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService, DataService],
})
export class ClassesModule {}
