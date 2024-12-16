import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { DirectoratesDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DirectoratesService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async create(dto: DirectoratesDto) {
    try {
      const directorate = await this.prisma.directorates.create({
        data: {
          directorateName: dto.directorateName,
          description: dto.description,
          
        },
      });

      const token = await this.directorateToken(directorate.directorateName, directorate.description);
      return {
        message: 'Directorate created successfully',
        token: token,
        directorate
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Directorate already exists. Please create a new one!');
        }
      }
      throw error;
    }
  }

  async directorateToken(
    directorateName: string,
    description: string
  ): Promise<{ access_token: string }> {
    const payload = {
      directorateName,
      description
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60min',
      secret: secret
    });
    return {
      access_token: token
    };
  }

  async getDirectorateById(directorateId: string) {
    const directorate = await this.prisma.directorates.findUnique({
      where: { Id: directorateId },
    });

    if (!directorate) {
      throw new NotFoundException('Directorate not found');
    }

    return directorate;
  }

  async getAllDirectorates() {
    return await this.prisma.directorates.findMany();
  }

  async deleteDirectorateById(directorateId: string) {
    const directorate = await this.prisma.directorates.findUnique({
      where: { Id: directorateId },
    });

    if (!directorate) {
      throw new NotFoundException('Directorate not found');
    }

    await this.prisma.directorates.delete({
      where: { Id: directorateId },
    });

    return {
      message: 'Directorate deleted successfully'
    };
  }

  async updateDirectorateById(directorateId: string, dto: DirectoratesDto) {
    const directorate = await this.prisma.directorates.findUnique({
      where: { Id: directorateId },
    });

    if (!directorate) {
      throw new NotFoundException('Directorate not found');
    }

    const updatedDirectorate = await this.prisma.directorates.update({
      where: { Id: directorateId },
      data: {
        directorateName: dto.directorateName, 
        description: dto.description, 
       
      },
    });

    return updatedDirectorate;
  }


  async searchDirectorateByName(directorateName: string) {
    const directorates = await this.prisma.directorates.findMany({
      where: { directorateName: { contains: directorateName, mode: 'insensitive' } },
    });

    if (!directorates.length) {
      throw new NotFoundException('No directorates found');
    }

    return directorates;
  }






  async getDirectoratesByUserId(userId: string) {
    try {
      
      const directorates = await this.prisma.directorates.findMany({
        where: {
          users: {
            some: {
              userId: userId,
            },
          },
        },
      });

      if (!directorates.length) {
        throw new NotFoundException('No directorates found for this user');
      }

      return directorates;
    } catch (error) {
      throw error;
    }
  }



}

