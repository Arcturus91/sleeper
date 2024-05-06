import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../database';
@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  email: string;
  @Column()
  password: string;
}
