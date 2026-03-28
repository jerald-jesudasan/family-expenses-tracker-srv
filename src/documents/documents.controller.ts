import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  getAll(@Query('familyId') familyId: string) {
    return this.documentsService.getAll(familyId);
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.documentsService.create(body, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.documentsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.documentsService.delete(id);
  }
}
