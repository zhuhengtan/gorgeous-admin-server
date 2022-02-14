import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm'
import moment from 'moment'
import { User } from './user'
import { Operation } from './operation'

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToOne(() => User)
  @JoinColumn({
    name: 'creator_uid'
  })
  creator: User

  @ManyToMany(()=>Operation)
  @JoinTable()
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