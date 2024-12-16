import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { DepartmentsDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DepartmentsService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async create(dto: DepartmentsDto, directorateId: string) {
    try {
      const directorate = await this.prisma.directorates.findUnique({
        where: { Id: directorateId },
      });

      if (!directorate) {
        throw new NotFoundException('Directorate not found');
      }

      const department = await this.prisma.departments.create({
        data: {
          departmentName: dto.departmentName,
          directorateName: directorate.directorateName, 
          directorateId: directorateId,
        },
      });

      const token = await this.departmentToken(department.departmentName);
      return {
        message: 'Department created successfully',
        token: token,
        department,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Department exists. Please create a new one!');
        }
      }
      throw error;
    }
  }

  async departmentToken(departmentName: string): Promise<{ access_token: string }> {
    const payload = { departmentName };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60min',
      secret: secret,
    });
    return { access_token: token };
  }

  async getDepartmentById(departmentId: string) {
    const department = await this.prisma.departments.findUnique({
      where: { Id: departmentId },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async getAllDepartments() {
    return await this.prisma.departments.findMany();
  }

  async getDepartmentsByDirectorateId(directorateId: string) {
    const departments = await this.prisma.departments.findMany({
      where: { directorateId },
    });

    if (!departments || departments.length === 0) {
      throw new NotFoundException('No departments found for this directorate');
    }

    return departments;
  }

  async deleteDepartmentById(departmentId: string) {
    const department = await this.prisma.departments.findUnique({
      where: { Id: departmentId },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    await this.prisma.departments.delete({
      where: { Id: departmentId },
    });

    return {
      message: 'Department deleted successfully',
    };
  }

  async updateDepartmentById(departmentId: string, dto: DepartmentsDto) {
    const department = await this.prisma.departments.findUnique({
      where: { Id: departmentId },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const updatedDepartment = await this.prisma.departments.update({
      where: { Id: departmentId },
      data: {
        departmentName: dto.departmentName,
      },
    });

    return updatedDepartment;
  }


  async searchDepartmentByName(departmentName: string) {
    const departments = await this.prisma.departments.findMany({
      where: { departmentName: { contains: departmentName, mode: 'insensitive' } },
    });

    if (!departments.length) {
      throw new NotFoundException('No departments found');
    }

    return departments;
  }

}
