import { Customer } from './Customer';
import { MedicalCondition } from './MedicalCondition';

export interface CustomerMedicalCondition extends Customer, MedicalCondition {}
