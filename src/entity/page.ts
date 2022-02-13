import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import moment from 'moment'

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    comment: '前端路由'
  })
  path: string

  @CreateDateColumn({
    name: 'created_at',
    transformer: {
      from: (e: any) => moment(e).utcOffset(+480).format('YYYY-MM-DD HH:mm:ss'),
      to: (e: any) => moment(e).utcOffset(+480).format('YYYY-MM-DD HH:mm:ss')
    } as any,
  })
  createdAt: Date
}