import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
require('dotenv').config();

const env = process.env;
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...({ host: 'localhost' } || {
        host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
      }),
      type: 'postgres',
      port: Number(env.DB_PORT),
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      entities: [env.ENTITIES],
      synchronize: true,
    }),

    UsersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
