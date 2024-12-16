import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { TypesDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TypesService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async create(dto: TypesDto, divisionId: string) {
     
      const division = await this.prisma.divisions.findUnique({
        where: { Id: divisionId },
      });

      if (!division) {
        throw new NotFoundException('Division not found');
      }

      const type = await this.prisma.types.create({
        data: {
          typeName: dto.typeName,
          docUpload: [],
          divisionName: division.divisionName, 
          divisionId: divisionId,
        },
      });

      const token = await this.typeToken(type.typeName);
      return {
        message: 'Type created successfully',
        token: token,
        type,
      };
    } 
  

  async typeToken(typeName: string): Promise<{ access_token: string }> {
    const payload = { typeName };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60min',
      secret: secret,
    });
    return { access_token: token };
  }

  async getTypeById(typeId: string) {
    const type = await this.prisma.types.findUnique({
      where: { Id: typeId },
    });

    if (!type) {
      throw new NotFoundException('Type not found');
    }

    return type;
  }

  async getAllTypes() {
    return await this.prisma.types.findMany();
  }

  async getTypesByDivisionId(divisionId: string) {
    const types = await this.prisma.types.findMany({
      where: { divisionId },
    });

    if (!types || types.length === 0) {
      throw new NotFoundException('No types found for this division');
    }

    return types;
  }

  async deleteTypeById(typeId: string) {
    const type = await this.prisma.types.findUnique({
      where: { Id: typeId },
    });

    if (!type) {
      throw new NotFoundException('Type not found');
    }

    await this.prisma.types.delete({
      where: { Id: typeId },
    });

    return {
      message: 'Type deleted successfully',
    };
  }

  async updateTypeById(typeId: string, dto: TypesDto) {
    const type = await this.prisma.types.findUnique({
      where: { Id: typeId },
    });

    if (!type) {
      throw new NotFoundException('Type not found');
    }

    const updatedType = await this.prisma.types.update({
      where: { Id: typeId },
      data: {
        typeName: dto.typeName,
      },
    });

    return updatedType;
  }


  async searchTypeByName(typeName: string) {
    const types = await this.prisma.types.findMany({
      where: { typeName: { contains: typeName, mode: 'insensitive' } },
    });

    if (!types.length) {
      throw new NotFoundException('No types found');
    }

    return types;
  }

}
