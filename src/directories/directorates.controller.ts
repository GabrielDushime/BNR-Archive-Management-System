import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DirectoratesDto } from "./dto";
import { DirectoratesService } from "./directorates.service";
import { AdminRoleGuard } from "src/auth/guards/admin-role.guard";
import { BothRoleGuard } from "src/auth/guards/both-role.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserRoleGuard } from "src/auth/guards/user-role.guard";
import { superRoleGuard } from "src/auth/guards/super.guard";

@ApiTags('Directorates Management')
 
@ApiBearerAuth('Authentication')
@Controller('directorates')
export class DirectoriesController {
  constructor(private directorateService: DirectoratesService) {}

 
  @ApiOperation({ summary: 'Creating new Directorate' })
   @UseGuards(AdminRoleGuard) 
  @Post('create')
  @ApiBody({ type: DirectoratesDto })
  create(@Body() dto: DirectoratesDto, @Body('departmentName')  @Body('departmentId') departmentId: string) {
    return this.directorateService.create(dto, );
  }
  @Get('directorates')
  @UseGuards(superRoleGuard) 
  @ApiOperation({ summary: 'Get all directorates' })
  getAllcats() {
    return this.directorateService.getAllDirectorates();
  }

  @ApiOperation({ summary: 'Get directorate by ID' })
   @UseGuards(AdminRoleGuard) 
  @Get('directorate/:id')
  getCatById(@Param('id') id: string) {
    return this.directorateService.getDirectorateById(id);
  }

  @Get('search')
  @UseGuards(BothRoleGuard,superRoleGuard)
  @ApiOperation({ summary: 'Search for directorate by name' })
  async searchDirectoratesByName(@Query('departmentName') name: string) {
   return this.directorateService.searchDirectorateByName(name);
   
  }

  @ApiOperation({ summary: 'Updating Directorate by ID' })
   @UseGuards(AdminRoleGuard)  
  @Put('update/directorate/:id')
  updateDirectoryById(@Param('id') id: string, @Body() dto: DirectoratesDto) {
    return this.directorateService.updateDirectorateById(id, dto);
  }

  @ApiOperation({ summary: 'Delete cat by ID' })
  @UseGuards(AdminRoleGuard) 
  @Delete('/delete/directorate/:id')
  deleteCatById(@Param('id') id: string) {
    return this.directorateService.deleteDirectorateById(id);
  }


  
  @ApiBearerAuth('Authentication')
  @ApiOperation({ summary: 'Get directorates by logged-in user' })
  @UseGuards(JwtAuthGuard,UserRoleGuard)
  @Get('user')
  async getDirectoratesByUser(@Req() req) {
    const userId = req.user?.Id; 

    if (!userId) {
      throw new BadRequestException('User ID not found');
    }

    return this.directorateService.getDirectoratesByUserId(userId);
  }

 

}
