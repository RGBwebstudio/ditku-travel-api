import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config'

import configuration from '../config/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { FaqModule } from './faq/faq.module'
import { MailLayoutModule } from './mail-layout/mail-layout.module'
import { MailSenderModule } from './mail-sender/mail-sernder.module'
import { ParameterModule } from './parameter/parameter.module'
import { ParameterCategoryModule } from './parameter-category/parameter-category.module'
import { ProductModule } from './product/product.module'
import { FormatGroupModule } from './format-group/format-group.module'
import { RoadmapModule } from './roadmap/roadmap.module'
import { CityModule } from './city/city.module'
import { UserModule } from './user/user.module'
import { CountryModule } from './country/country.module'
import { RatingModule } from './product-rating/rating.module'
import { MainPageModule } from './main-page/main-page.module'
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module'
import { TermsOfUseModule } from './terms-of-use/terms-of-use.module'
import { CookieModule } from './cookie/cookie.module'
import { DAPModule } from './delivery-and-payment/faq.module'
import { ContactsModule } from './сontacts/contacts.module'
import { BannerModule } from './banners/brand.module'
import { SettingsModule } from './settings/settings.module'
import { SeoBlocksModule } from './seo-blocks/seo-blocks.module'
import { SeoFilterModule } from './seo-filter/seo-filter.module'
import { PostModule } from './posts/post.module'
import { SectionModule } from './section/section.module'
import { PromocodeModule } from './promocode/promocode.module'

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
    SettingsModule,
    SeoBlocksModule,
    SeoFilterModule,
    PostModule,
    SectionModule,
    PromocodeModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
