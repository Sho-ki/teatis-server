import { Global, Module, ModuleMetadata } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CustomerGeneralRepository } from './repositories/teatisDB/customer/customerGeneral.repository';
import { EmployeeRepository } from './repositories/teatisDB/employee/employee.repository';
import { ProductGeneralRepository } from './repositories/teatisDB/product/productGeneral.repository';
import { TerraRepository } from './repositories/terra/terra.repository';

const createGlobalModule = (repositories, configurations) => {
  const globalModule: ModuleMetadata = { providers: [], exports: [] };

  for(const configuration of configurations) {
    globalModule.providers.push(configuration);
    globalModule.exports.push(configuration);
  }
  for(const repository of repositories) {
    globalModule.providers.push(repository);
    globalModule.providers.push({
      provide: `${repository.name}Interface`,
      useExisting: repository,
    });
    globalModule.exports.push(`${repository.name}Interface`);
  }
  return globalModule;
};

@Global()
@Module(createGlobalModule([
  CustomerGeneralRepository,
  EmployeeRepository,
  ProductGeneralRepository,
  TerraRepository,
], [PrismaService]))
export class GlobalModule {}
