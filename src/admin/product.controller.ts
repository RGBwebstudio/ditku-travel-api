import { Controller, UseGuards } from '@nestjs/common'
import { ProductController } from 'src/product/product.controller'
import { ProductService } from 'src/product/product.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/product')
export class AdminProductController extends ProductController {
  constructor(productService: ProductService) {
    super(productService)
  }
}
