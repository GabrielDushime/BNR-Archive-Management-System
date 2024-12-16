import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DivisionsDto } from "./dto";
import { DivisionsService } from "./division.service";
import { AdminRoleGuard } from "src/auth/guards/admin-role.guard";
import { BothRoleGuard } from "src/auth/guards/both-role.guard";
import { superRoleGuard } from "src/auth/guards/super.guard";

@ApiTags('Division Management')
@ApiBearerAuth('Authentication')
@Controller('divisions')
export class DivisionsController {
  constructor(private divisionsService: DivisionsService) {}

  @ApiOperation({ summary: 'Creating new Division' })
  @UseGuards(AdminRoleGuard) 
  @Post('create/:departmentId')
  @ApiBody({ type: DivisionsDto })
  create(@Param('departmentId') divisionId: string, @Body() dto: DivisionsDto) {
    return this.divisionsService.create(dto, divisionId);
  }

  @Get('divisions')
 @UseGuards(BothRoleGuard) 
  @ApiOperation({ summary: 'Get all divisions' })
  getAllDivisions() {
    return this.divisionsService.getAllDivisions();
  }

  @ApiOperation({ summary: 'Get division by ID' })

  @Get('division/:id')
  getDivisionById(@Param('id') id: string) {
    return this.divisionsService.getDivisionById(id);
  }

  @Get('search')
   @UseGuards(BothRoleGuard) 
  @ApiOperation({ summary: 'Search for division by name' })
  async searchdivisionByName(@Query('divisionName') name: string) {
   return this.divisionsService.searchDivisionByName(name);
   
  }
  
  @ApiOperation({ summary: 'Get division by department ID' })
   @UseGuards(BothRoleGuard) 
  @Get('department/division/:departmentId')
  getDivisionByDirectorateId(@Param('departmentId') departmentId: string) {
    return this.divisionsService.getDivisionsByDepartmentId(departmentId);
  }

  @ApiOperation({ summary: 'Updating division by ID' })
   @UseGuards(AdminRoleGuard) 
  @Put('update/division/:id')
  updateDivisionById(@Param('id') id: string, @Body() dto: DivisionsDto) {
    return this.divisionsService.updateDivisionById(id, dto);
  }

  @ApiOperation({ summary: 'Delete division by ID' })
 @UseGuards(AdminRoleGuard) 
  @Delete('/delete/division/:id')
  deleteDivisionById(@Param('id') id: string) {
    return this.divisionsService.deleteDivisionById(id);
  }
}
