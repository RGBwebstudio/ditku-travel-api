import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { ProductController } from 'src/modules/product/product.controller'
import { ProductService } from 'src/modules/product/product.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/product')
export class AdminProductController extends ProductController {
  constructor(productService: ProductService) {
    super(productService)
  }
}
