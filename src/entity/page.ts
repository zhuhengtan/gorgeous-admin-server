import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm'
import moment from 'moment'
import { Operation } from './operation'

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(()=>Page)
  @JoinColumn({
    name: 'parent_page_id',
  })
  parentPage: Page | null

  @OneToMany(()=>Page, page=>page.parentPage)
  children: Page[]

  @Column({
    comment: '前端路由',
  })
  path: string

  @Column({
    comment: '页面类型，0为手写页面，1为配置页面，2为配置后手写页面（模板生成代码）',
    name: 'page_type',
    default: 0,
  })
  pageType: number

  @Column({
    comment: '页面实体',
    name: 'entity_name',
    default: '',
  })
  entityName: string

  @Column({
    comment: '配置页面的内容（json）',
    type: 'json',
    default: null,
  })
  content: string

  @OneToMany(() => Operation, (operation) => operation.page)
  operations: Operation[]

  @CreateDateColumn({
    name: 'created_at',
    transformer: {
      from: (e: any) => moment(e).format('YYYY-MM-DD HH:mm:ss'),
      to: (e: any) => moment(e).format('YYYY-MM-DD HH:mm:ss'),
    } as any,
  })
  createdAt: Date
}
