 import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm'
import { Role } from './role'
import moment from 'moment'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ select: false })
  password: string

  @Column()
  email: string

  @Column({
    name: 'user_type'
  })
  userType: number

  @Column()
  avatar: string

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToOne(() => User)
  @JoinColumn({
    name: 'creator_uid'
  })
  creator: User

  @CreateDateColumn({
    name: 'created_at',
    transformer: {
      from: (e: any) => moment(e).utcOffset(+480).format('YYYY-MM-DD HH:mm:ss'),
      to: (e: any) => moment(e).utcOffset(+480).format('YYYY-MM-DD HH:mm:ss')
    } as any,
  })
  createdAt: Date
}