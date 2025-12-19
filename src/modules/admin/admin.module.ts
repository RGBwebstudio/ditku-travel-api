import { Module } from '@nestjs/common'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { BannerModule } from 'src/modules/banners/brand.module'
import { CategoryModule } from 'src/modules/category/category.module'
import { CountryModule } from 'src/modules/country/country.module'
import { CityModule } from 'src/modules/city/city.module'
import { ProductModule } from 'src/modules/product/product.module'
import { PostCategoryModule } from 'src/modules/post-category/post-category.module'
import { PostModule } from 'src/modules/posts/post.module'
import { FaqModule } from 'src/modules/faq/faq.module'
import { TermsOfUseModule } from 'src/modules/terms-of-use/terms-of-use.module'
import { CookieModule } from 'src/modules/cookie/cookie.module'
import { DAPModule } from 'src/modules/delivery-and-payment/faq.module'
import { UserModule } from 'src/modules/user/user.module'
import { ParameterModule } from 'src/modules/parameter/parameter.module'
import { ParameterCategoryModule } from 'src/modules/parameter-category/parameter-category.module'
import { SeoBlocksModule } from 'src/modules/seo-blocks/seo-blocks.module'
import { SeoFilterModule } from 'src/modules/seo-filter/seo-filter.module'
import { SectionModule } from 'src/modules/section/section.module'
import { MenuModule } from 'src/modules/menu/menu.module'
import { ContactsModule } from 'src/modules/сontacts/contacts.module'
import { PrivacyPolicyModule } from 'src/modules/privacy-policy/privacy-policy.module'
import { MainPageModule } from 'src/modules/main-page/main-page.module'
import { VideoModule } from 'src/modules/video/video.module'

import { AdminBannerController } from './banner.controller'
import { AdminCategoryController } from './category.controller'
import { AdminCountryController } from './country.controller'
import { AdminCityController } from './city.controller'
import { AdminProductController } from './product.controller'
import { AdminPostCategoryController } from './post-category.controller'
import { AdminPostController } from './post.controller'
import { AdminFaqController } from './faq.controller'
import { AdminCookieController } from './cookie.controller'
import { AdminDapController } from './dap.controller'
import { AdminParameterController } from './parameter.controller'
import { AdminParameterCategoryController } from './parameter-category.controller'
import { AdminSeoBlocksController } from './seo-blocks.controller'
import { AdminSeoFilterController } from './seo-filter.controller'
import { AdminSectionController } from './section.controller'
import { AdminTermsOfUseController } from './terms-of-use.controller'
import { AdminContactsController } from './contacts.controller'
import { AdminPrivacyPolicyController } from './privacy-policy.controller'
import { AdminMenuController } from './menu.controller'
import { AdminMainPageController } from './main-page.controller'
import { AdminVideoCategoryController } from './video-category.controller'
import { AdminVideoController } from './video.controller'

@Module({
  imports: [
    BannerModule,
    CategoryModule,
    CountryModule,
    CityModule,
    ProductModule,
    PostCategoryModule,
    PostModule,
    FaqModule,
    CookieModule,
    ContactsModule,
    DAPModule,
    UserModule,
    ParameterModule,
    ParameterCategoryModule,
    SeoBlocksModule,
    SeoFilterModule,
    MenuModule,
    SectionModule,
    TermsOfUseModule,
    PrivacyPolicyModule,
    MainPageModule,
    VideoModule
  ],
  controllers: [
    AdminBannerController,
    AdminCategoryController,
    AdminCountryController,
    AdminPostController,
    AdminPostCategoryController,
    AdminCityController,
    AdminProductController,
    AdminFaqController,
    AdminCookieController,
    AdminDapController,
    AdminTermsOfUseController,
    AdminContactsController,
    AdminPrivacyPolicyController,
    AdminParameterController,
    AdminParameterCategoryController,
    AdminSeoBlocksController,
    AdminSeoFilterController,
    AdminMenuController,
    AdminMainPageController,
    AdminSectionController,
    AdminVideoCategoryController,
    AdminVideoController
  ],
  providers: [AuthAdminGuard]
})
export class AdminModule {}
