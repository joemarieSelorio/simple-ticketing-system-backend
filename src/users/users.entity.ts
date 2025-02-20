import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @Column()
  @PrimaryGeneratedColumn()
  uuid: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  type: string;
}
