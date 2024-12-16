import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { DivisionsDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DivisionsService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async create(dto: DivisionsDto, departmentId: string) {
    try {
      const department = await this.prisma.departments.findUnique({
        where: { Id: departmentId },
      });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      const division = await this.prisma.divisions.create({
        data: {
          divisionName: dto.divisionName,
          departmentName: department.departmentName, 
          departmentId: departmentId,
        },
      });

      const token = await this.divisionToken(division.divisionName);
      return {
        message: 'Division created successfully',
        token: token,
        division,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Division exists. Please create a new one!');
        }
      }
      throw error;
    }
  }

  async divisionToken(divisionName: string): Promise<{ access_token: string }> {
    const payload = { divisionName };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60min',
      secret: secret,
    });
    return { access_token: token };
  }

  async getDivisionById(divisionId: string) {
    const division = await this.prisma.divisions.findUnique({
      where: { Id: divisionId },
    });

    if (!division) {
      throw new NotFoundException('Division not found');
    }

    return division;
  }

  async getAllDivisions() {
    return await this.prisma.divisions.findMany();
  }

  async getDivisionsByDepartmentId(departmentId: string) {
    const divisions = await this.prisma.divisions.findMany({
      where: { departmentId },
    });

    if (!divisions || divisions.length === 0) {
      throw new NotFoundException('No Divisons found for this department');
    }

    return divisions;
  }

  async deleteDivisionById(divisionId: string) {
    const division = await this.prisma.divisions.findUnique({
      where: { Id: divisionId },
    });

    if (!division) {
      throw new NotFoundException('Division not found');
    }

    await this.prisma.divisions.delete({
      where: { Id: divisionId },
    });

    return {
      message: 'Division deleted successfully',
    };
  }

  async updateDivisionById(divisionId: string, dto: DivisionsDto) {
    const division = await this.prisma.divisions.findUnique({
      where: { Id: divisionId },
    });

    if (!division) {
      throw new NotFoundException('Division not found');
    }

    const updatedDivision = await this.prisma.divisions.update({
      where: { Id: divisionId },
      data: {
        divisionName: dto.divisionName,
      },
    });

    return updatedDivision;
  }


  async searchDivisionByName(divisionName: string) {
    const divisions = await this.prisma.divisions.findMany({
      where: { divisionName: { contains: divisionName, mode: 'insensitive' } },
    });

    if (!divisions.length) {
      throw new NotFoundException('No divisions found');
    }

    return divisions;
  }

}
