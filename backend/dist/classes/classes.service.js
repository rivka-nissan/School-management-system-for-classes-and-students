"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const data_service_1 = require("../data.service");
let ClassesService = class ClassesService {
    data;
    constructor(data) {
        this.data = data;
    }
    findAll() {
        return this.data.classes.map((c) => ({
            ...c,
            studentsCount: this.data.students.filter((s) => s.classId === c.id).length,
        }));
    }
    findOne(id) {
        const cls = this.data.classes.find((c) => c.id === id);
        if (!cls)
            throw new common_1.NotFoundException(`Class ${id} not found`);
        return { ...cls, studentsCount: this.data.students.filter((s) => s.classId === id).length };
    }
    create(dto) {
        const newClass = {
            id: Math.max(0, ...this.data.classes.map((c) => c.id)) + 1,
            studentsCount: 0,
            ...dto,
        };
        this.data.classes.push(newClass);
        return newClass;
    }
    update(id, dto) {
        const idx = this.data.classes.findIndex((c) => c.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Class ${id} not found`);
        this.data.classes[idx] = { ...this.data.classes[idx], ...dto };
        return this.findOne(id);
    }
    remove(id) {
        const idx = this.data.classes.findIndex((c) => c.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Class ${id} not found`);
        this.data.classes.splice(idx, 1);
    }
    getStudents(id) {
        this.findOne(id);
        return this.data.students.filter((s) => s.classId === id);
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [data_service_1.DataService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map