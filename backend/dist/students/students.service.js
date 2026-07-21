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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const data_service_1 = require("../data.service");
let StudentsService = class StudentsService {
    data;
    constructor(data) {
        this.data = data;
    }
    create(dto) {
        const newStudent = {
            id: Math.max(0, ...this.data.students.map((s) => s.id)) + 1,
            ...dto,
        };
        this.data.students.push(newStudent);
        return newStudent;
    }
    update(id, dto) {
        const idx = this.data.students.findIndex((s) => s.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException(`Student ${id} not found`);
        this.data.students[idx] = { ...this.data.students[idx], ...dto };
        return this.data.students[idx];
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [data_service_1.DataService])
], StudentsService);
//# sourceMappingURL=students.service.js.map