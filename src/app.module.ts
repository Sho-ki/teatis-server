import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
require('dotenv').config();

const env = process.env;
@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: `localhost`,
    //   port: Number(env.DB_PORT),
    //   username: env.DB_USER,
    //   password: env.DB_PASSWORD,
    //   database: env.DB_DATABASE,
    //   entities: ['dist/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
      port: Number(env.DB_PORT),
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    UsersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
