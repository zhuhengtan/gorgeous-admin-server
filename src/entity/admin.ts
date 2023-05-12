import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm'
import { Role } from './role'
import moment from 'moment'
import { Operation } from './operation'

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ select: false })
  password: string

  @Column()
  email: string

  @Column({
    name: 'admin_type',
    comment: '0系统用户，1手动创建用户',
    default: 1,
  })
  adminType: number

  @Column({
    comment: '状态：1正常，0禁用',
    default: 1,
  })
  status: number

  @Column({
    default: '',
  })
  avatar: string

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'admin_role',
    joinColumns: [
      {
        name: 'admin_id',
      },
    ],
    inverseJoinColumns: [
      {
        name: 'role_id',
      },
    ],
  })
  roles: Role[]

  @ManyToOne(() => Admin, (admin) => admin.createdAdmins)
  @JoinColumn({
    name: 'creator_uid',
  })
  creator: Admin
  
  @OneToMany(() => Role, (role) => role.creator)
  @JoinColumn()
  createdRoles: Role[]

  @OneToMany(() => Admin, (admin) => admin.creator)
  @JoinColumn()
  createdAdmins: Admin[]

  @OneToMany(() => Operation, (operation) => operation.creator)
  @JoinColumn()
  createdOperations: Operation[]

  @CreateDateColumn({
    name: 'created_at',
    transformer: {
      from: (e: any) => moment(e).format('YYYY-MM-DD HH:mm:ss'),
      to: (e: any) => moment(e).format('YYYY-MM-DD HH:mm:ss'),
    } as any,
  })
  createdAt: Date
}
