// src/role/role.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  OneToMany 
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('Role') // Ánh xạ với bảng 'Role'
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  // Quan hệ: Một Role có nhiều User
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}