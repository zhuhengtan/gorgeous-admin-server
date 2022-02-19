import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm'
import moment from 'moment'
import { Operation } from './operation'

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    comment: '前端路由'
  })
  path: string

  @OneToMany(()=>Operation, operation=>operation.page)
  @JoinColumn()
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