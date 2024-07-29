import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesDto } from "./dto";
import { CategoriesService } from "./categories.service";
import { AdminRoleGuard } from "src/auth/guards/admin-role.guard";

@ApiTags('Categories Management')
/* @UseGuards(AdminRoleGuard) */
@ApiBearerAuth('Authentication')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Creating new category' })

 
  @Post('create')
  @ApiBody({ type: CategoriesDto })
  create(@Body() dto: CategoriesDto) {
    return this.categoriesService.create(dto);
  }

  @Get('cats')
  @ApiOperation({ summary: 'Get all categories' })
  getAllcats() {
    return this.categoriesService.getAllCats();
  }

  @ApiOperation({ summary: 'Get cat by ID' })
  @Get('cat/:id')
  getCatById(@Param('id') id: string) {
    return this.categoriesService.getCatById(id);
  }

  @ApiOperation({ summary: 'Updating cat by ID' })
  @Put('update/cat/:id')
  updateCatById(@Param('id') id: string, @Body() dto: CategoriesDto) {
    return this.categoriesService.updateCatById(id, dto);
  }

  @ApiOperation({ summary: 'Delete cat by ID' })
  @Delete('/delete/cat/:id')
  deleteCatById(@Param('id') id: string) {
    return this.categoriesService.deleteCatById(id);
  }
}
