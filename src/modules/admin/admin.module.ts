import { Module } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { BannerModule } from 'src/modules/banners/brand.module'
import { CategoryModule } from 'src/modules/category/category.module'
import { CityModule } from 'src/modules/city/city.module'
import { CookieModule } from 'src/modules/cookie/cookie.module'
import { CountryModule } from 'src/modules/country/country.module'
import { FaqModule } from 'src/modules/faq/faq.module'
import { MainPageModule } from 'src/modules/main-page/main-page.module'
import { MenuModule } from 'src/modules/menu/menu.module'
import { ParameterModule } from 'src/modules/parameter/parameter.module'
import { ParameterCategoryModule } from 'src/modules/parameter-category/parameter-category.module'
import { PostCategoryModule } from 'src/modules/post-category/post-category.module'
import { PostModule } from 'src/modules/posts/post.module'
import { PrivacyPolicyModule } from 'src/modules/privacy-policy/privacy-policy.module'
import { ProductModule } from 'src/modules/product/product.module'
import { RatingModule } from 'src/modules/product-rating/rating.module'
import { SectionModule } from 'src/modules/section/section.module'
import { SeoBlocksModule } from 'src/modules/seo-blocks/seo-blocks.module'
import { SeoFilterModule } from 'src/modules/seo-filter/seo-filter.module'
import { TermsOfUseModule } from 'src/modules/terms-of-use/terms-of-use.module'
import { UserModule } from 'src/modules/user/user.module'
import { VideoModule } from 'src/modules/video/video.module'
import { ContactsModule } from 'src/modules/сontacts/contacts.module'

import { AdminBannerController } from './banner.controller'
import { AdminCategoryController } from './category.controller'
import { AdminCityController } from './city.controller'
import { AdminContactsController } from './contacts.controller'
import { AdminCookieController } from './cookie.controller'
import { AdminCountryController } from './country.controller'
import { AdminFaqController } from './faq.controller'
import { AdminMainPageController } from './main-page.controller'
import { AdminMenuController } from './menu.controller'
import { AdminParameterCategoryController } from './parameter-category.controller'
import { AdminParameterController } from './parameter.controller'
import { AdminPostCategoryController } from './post-category.controller'
import { AdminPostController } from './post.controller'
import { AdminPrivacyPolicyController } from './privacy-policy.controller'
import { AdminProductController } from './product.controller'
import { AdminSectionController } from './section.controller'
import { AdminSeoBlocksController } from './seo-blocks.controller'
import { AdminSeoFilterController } from './seo-filter.controller'
import { AdminTermsOfUseController } from './terms-of-use.controller'
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
    VideoModule,
    RatingModule,
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
    AdminVideoController,
  ],
  providers: [AuthAdminGuard],
})
export class AdminModule {}
