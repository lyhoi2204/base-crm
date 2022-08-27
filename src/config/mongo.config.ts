import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:1@localhost:27018/crm?authSource=admin&readPreference=primary',
    ),
  ],
})
export class MongoConfigModule {}
