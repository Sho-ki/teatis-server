import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  typeform_id: string;

  @Column()
  BMR: number;

  @Column()
  carbs_macronutrients: number;

  @Column()
  protein_macronutrients: number;

  @Column()
  fat_macronutrients: number;

  @Column()
  carorie_macronutrients: number;

  @Column()
  carbs_per_meal: number;

  @Column()
  protein_per_meal: number;

  @Column()
  fat_per_meal: number;

  @Column()
  carorie_per_meal: number;
}
