import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm'
import { User } from './user'
import moment from 'moment'
import { Page } from './page'

@Entity('operations')
export class Operation {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  key: string

  @ManyToOne(()=>Page, page=>page.operations)
  @JoinColumn({
    name: 'page_id'
  })
  page: Page

  @Column({
    name: 'related_api'
  })
  relatedApi: string
  
  @OneToOne(() => User)
  @JoinColumn({
    name: 'creator_uid'
  })
  creator: User

  @CreateDateColumn({
    name: 'created_at',
    transformer: {
      from: (e: any) => moment(e).format('YYYY-MM-DD HH:mm:ss'),
      to: (e: any) => moment(e).format('YYYY-MM-DD HH:mm:ss')
    } as any,
  })
  createdAt: Date
}