import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm'
import moment from 'moment'
import { Admin } from './admin'
import { Operation } from './operation'

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    name: 'role_type',
    comment: '角色类型，1系统角色，2手动创建角色，仅手动创建角色可编辑删除',
  })
  roleType: number

  @Column({
    default: ''
  })
  description: string

  @OneToOne(() => Admin)
  @JoinColumn({
    name: 'creator_uid'
  })
  creator: Admin

  @ManyToMany(()=>Operation)
  @JoinTable({
    name: 'role_operation',
    joinColumns: [{
      name: 'role_id'
    }],
    inverseJoinColumns: [{
      name: 'operation_id'
    }]
  })
  operations: Operation[]

  @CreateDateColumn({
    name: 'created_at',
    transformer: {
      from: (e: any) => moment(e).format('YYYY-MM-DD HH:mm:ss'),
      to: (e: any) => moment(e).format('YYYY-MM-DD HH:mm:ss')
    } as any,
  })
  createdAt: Date
}