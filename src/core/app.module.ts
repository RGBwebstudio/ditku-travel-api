import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config'

import configuration from '../../config/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from '../modules/category/category.module'
import { FaqModule } from '../modules/faq/faq.module'
import { MailLayoutModule } from '../modules/mail-layout/mail-layout.module'
import { MailSenderModule } from '../modules/mail-sender/mail-sernder.module'
import { ParameterModule } from '../modules/parameter/parameter.module'
import { ParameterCategoryModule } from '../modules/parameter-category/parameter-category.module'
import { ProductModule } from '../modules/product/product.module'
import { FormatGroupModule } from '../modules/format-group/format-group.module'
import { RoadmapModule } from '../modules/roadmap/roadmap.module'
import { CityModule } from '../modules/city/city.module'
import { UserModule } from '../modules/user/user.module'
import { CountryModule } from '../modules/country/country.module'
import { RatingModule } from '../modules/product-rating/rating.module'
import { MainPageModule } from '../modules/main-page/main-page.module'
import { PrivacyPolicyModule } from '../modules/privacy-policy/privacy-policy.module'
import { TermsOfUseModule } from '../modules/terms-of-use/terms-of-use.module'
import { CookieModule } from '../modules/cookie/cookie.module'
import { DAPModule } from '../modules/delivery-and-payment/faq.module'
import { ContactsModule } from '../modules/сontacts/contacts.module'
import { BannerModule } from '../modules/banners/brand.module'
import { SeoBlocksModule } from '../modules/seo-blocks/seo-blocks.module'
import { SeoFilterModule } from '../modules/seo-filter/seo-filter.module'
import { PostModule } from '../modules/posts/post.module'
import { PostCategoryModule } from '../modules/post-category/post-category.module'
import { SectionModule } from '../modules/section/section.module'
import { MenuModule } from '../modules/menu/menu.module'
import { PromocodeModule } from '../modules/promocode/promocode.module'
import { AdminModule } from '../modules/admin/admin.module'
import { PageConstructorModule } from '../modules/page-constructor/page-constructor.module'
import { VideoModule } from '../modules/video/video.module'

const config = configuration()

@Module({
  imports: [
    ConfigModule.forRoot(<ConfigModuleOptions>{
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot(config.db),
    AuthModule,
    CategoryModule,
    FaqModule,
    MailLayoutModule,
    MailSenderModule,
    ParameterModule,
    ParameterCategoryModule,
    ProductModule,
    FormatGroupModule,
    RoadmapModule,
    CityModule,
    UserModule,
    UserModule,
    CountryModule,
    RatingModule,
    MainPageModule,
    DAPModule,
    ContactsModule,
    PrivacyPolicyModule,
    TermsOfUseModule,
    CookieModule,
    BannerModule,
    SeoBlocksModule,
    SeoFilterModule,
    PostModule,
    PostCategoryModule,
    SectionModule,
    MenuModule,
    PromocodeModule,
    AdminModule,
    PageConstructorModule,
    VideoModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
