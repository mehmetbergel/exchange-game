import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'name',
    nullable: false,
    length: 250,
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'email',
    nullable: false,
    length: 250,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'password',
    nullable: false,
    length: 255,
  })
  password: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: (): string => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: string | null;

  @OneToOne(() => Wallet, (wallet: Wallet) => wallet.userId)
  wallet: Wallet;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  static createUser(
    id?: number,
    name?: string,
    email?: string,
    password?: string,
    createdAt?: string | null,
  ): User {
    const user = new User();
    user.id = id as number;
    user.name = name as string;
    user.email = email as string;
    user.password = password as string;
    user.createdAt = createdAt as string;
    return user;
  }
}
