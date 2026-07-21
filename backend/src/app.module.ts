import { Module } from '@nestjs/common';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [ClassesModule, StudentsModule],
})
export class AppModule {}
