import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async create(dto: CategoriesDto) {
    try {
      const cat = await this.prisma.cats.create({
        data: {
          categoryName: dto.categoryName,
          description: dto.description,
          docUpload: []  
        },
      });

      const token = await this.catToken(cat.categoryName, cat.description);
      return {
        message: 'Category created successfully',
        token: token,
        cat
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Category Name exists. Please create a new one!');
        }
      }
      throw error; 
    }  
  }

  async catToken(
    categoryName: string,
    description: string
  ): Promise<{ access_token: string }> {
    const payload = {
      categoryName,
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

  async getCatById(catId: string) {
    const cat = await this.prisma.cats.findUnique({
      where: { Id: catId },
    });

    if (!cat) {
      throw new NotFoundException('Category not found');
    }

    return cat;
  }

  async getAllCats() {
    return await this.prisma.cats.findMany();
  }

  async deleteCatById(catId: string) {
    const cat = await this.prisma.cats.findUnique({
      where: { Id: catId },
    });

    if (!cat) {
      throw new NotFoundException('Category not found');
    }

    await this.prisma.cats.delete({
      where: { Id: catId },
    });

    return {
      message: 'Category deleted successfully'
    };
  }

  async updateCatById(catId: string, dto: CategoriesDto) {
    const cat = await this.prisma.cats.findUnique({
      where: { Id: catId },
    });

    if (!cat) {
      throw new NotFoundException('Category not found');
    }

    const updatedCat = await this.prisma.cats.update({
      where: { Id: catId },
      data: {
        categoryName: dto.categoryName,
        description: dto.description
       
      },
    });

    return updatedCat;
  }
}