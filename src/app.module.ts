import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigModule } from './config/mongo.config';
import { CoreModule } from './modules/core/core.module';

@Module({
  imports: [
    //Import config
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongoConfigModule,
    //Import Modules
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
