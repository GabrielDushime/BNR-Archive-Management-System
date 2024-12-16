import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TypesDto } from "./dto";
import { TypesService } from "./types.service";
import { AdminRoleGuard } from "src/auth/guards/admin-role.guard";
import { BothRoleGuard } from "src/auth/guards/both-role.guard";

@ApiTags('Types Management')
@ApiBearerAuth('Authentication')
@Controller('types')
export class TypesController {
  constructor(private typesService: TypesService) {}

  @ApiOperation({ summary: 'Creating new Type' })
  /* @UseGuards(AdminRoleGuard) */
  @Post('create/:divisionId')
  @ApiBody({ type: TypesDto })
  create(@Param('divisionId') divisionId: string, @Body() dto: TypesDto) {
    return this.typesService.create(dto, divisionId);
  }

  @Get('types')
  /* @UseGuards(BothRoleGuard) */
  @ApiOperation({ summary: 'Get all types' })
  getAllDepartments() {
    return this.typesService.getAllTypes();
  }

  @ApiOperation({ summary: 'Get type by ID' })

  @Get('type/:id')
  getTypeById(@Param('id') id: string) {
    return this.typesService.getTypeById(id);
  }

  @Get('search')
  /* @UseGuards(BothRoleGuard) */
  @ApiOperation({ summary: 'Search for Type by name' })
  async searchTypeByName(@Query('typeName') name: string) {
   return this.typesService.searchTypeByName(name);
   
  }
  
  @ApiOperation({ summary: 'Get types by division ID' })
  /* @UseGuards(BothRoleGuard) */
  @Get('division/types/:divisionId')
  getTypesByTypeId(@Param('divisionId') divisionId: string) {
    return this.typesService.getTypesByDivisionId(divisionId);
  }

  @ApiOperation({ summary: 'Updating division by ID' })
  /* @UseGuards(BothRoleGuard) */
  @Put('update/division/:id')
  updateTypeById(@Param('id') id: string, @Body() dto: TypesDto) {
    return this.typesService.updateTypeById(id, dto);
  }

  @ApiOperation({ summary: 'Delete type by ID' })
  /* @UseGuards(BothRoleGuard) */
  @Delete('/delete/type/:id')
  deleteTypeById(@Param('id') id: string) {
    return this.typesService.deleteTypeById(id);
  }
}
