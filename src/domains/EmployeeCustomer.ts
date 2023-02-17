import { Employee, Employer } from '@prisma/client';
import { Customer } from './Customer';

export interface EmployeeCustomer extends Customer {
    employee: Employee & {
        employer: Employer;
    };
}
