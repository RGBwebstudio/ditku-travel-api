import { Module } from '@nestjs/common'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

import { BannerModule } from 'src/banners/brand.module'
import { CategoryModule } from 'src/category/category.module'
import { CountryModule } from 'src/country/country.module'
import { CityModule } from 'src/city/city.module'
import { ProductModule } from 'src/product/product.module'
import { PostCategoryModule } from 'src/post-category/post-category.module'
import { PostModule } from 'src/posts/post.module'
import { FaqModule } from 'src/faq/faq.module'
import { TermsOfUseModule } from 'src/terms-of-use/terms-of-use.module'
import { CookieModule } from 'src/cookie/cookie.module'
import { DAPModule } from 'src/delivery-and-payment/faq.module'
import { UserModule } from 'src/user/user.module'
import { ParameterModule } from 'src/parameter/parameter.module'
import { ParameterCategoryModule } from 'src/parameter-category/parameter-category.module'
import { SeoBlocksModule } from 'src/seo-blocks/seo-blocks.module'
import { SeoFilterModule } from 'src/seo-filter/seo-filter.module'
import { SectionModule } from 'src/section/section.module'
import { MenuModule } from 'src/menu/menu.module'
import { ContactsModule } from 'src/сontacts/contacts.module'
import { PrivacyPolicyModule } from 'src/privacy-policy/privacy-policy.module'
import { MainPageModule } from 'src/main-page/main-page.module'
import { VideoModule } from 'src/video/video.module'

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
