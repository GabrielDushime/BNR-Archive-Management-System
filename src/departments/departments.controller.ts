import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DepartmentsDto } from "./dto";
import { DepartmentsService } from "./departments.service";
import { AdminRoleGuard } from "src/auth/guards/admin-role.guard";
import { BothRoleGuard } from "src/auth/guards/both-role.guard";


@ApiTags('Department Management')
@ApiBearerAuth('Authentication')
@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @ApiOperation({ summary: 'Creating new Department' })
   @UseGuards(AdminRoleGuard) 
  @Post('create/:directorateId')
  @ApiBody({ type: DepartmentsDto })
  create(@Param('directorateId') directorateId: string, @Body() dto: DepartmentsDto) {
    return this.departmentsService.create(dto, directorateId);
  }

  @Get('departments')
   @UseGuards(BothRoleGuard) 
  @ApiOperation({ summary: 'Get all departments' })
  getAllDepartments() {
    return this.departmentsService.getAllDepartments();
  }

  @ApiOperation({ summary: 'Get department by ID' })

  @Get('department/:id')
  getDepartmentById(@Param('id') id: string) {
    return this.departmentsService.getDepartmentById(id);
  }

  @Get('search')
   @UseGuards(BothRoleGuard) 
  @ApiOperation({ summary: 'Search for department by name' })
  async searchDepartmentByName(@Query('departmentName') name: string) {
   return this.departmentsService.searchDepartmentByName(name);
   
  }
  
  @ApiOperation({ summary: 'Get departments by directorate ID' })
   @UseGuards(BothRoleGuard) 
  @Get('directorate/departments/:directorateId')
  getDepartmentsByDirectorateId(@Param('directorateId') directorateId: string) {
    return this.departmentsService.getDepartmentsByDirectorateId(directorateId);
  }

  @ApiOperation({ summary: 'Updating department by ID' })
  @UseGuards(AdminRoleGuard) 
  @Put('update/department/:id')
  updateDepartmentById(@Param('id') id: string, @Body() dto: DepartmentsDto) {
    return this.departmentsService.updateDepartmentById(id, dto);
  }

  @ApiOperation({ summary: 'Delete department by ID' })
   @UseGuards(AdminRoleGuard) 
  @Delete('/delete/department/:id')
  deleteDepartmentById(@Param('id') id: string) {
    return this.departmentsService.deleteDepartmentById(id);
  }
}
