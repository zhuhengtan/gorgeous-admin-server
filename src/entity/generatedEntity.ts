import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm'
import moment from 'moment'

@Entity('generated_entities')
export class GeneratedEntity
{
  @PrimaryGeneratedColumn()
  id : number 

  @Column({
    name: 'entity_name',
    type: 'varchar',
  })
  entityName: string

  @Column({
    name: 'keys',
    type: 'json',
    comment: '字段',
  })
  keys: JSON
  
  @CreateDateColumn({
    name: 'created_at',
    transformer: {
      from: (e : any) => moment(e).format('YYYY-MM-DD HH:mm:ss'),
      to: (e : any) => moment(e).format('YYYY-MM-DD HH:mm:ss')
    } as any
  })
  createdAt : Date

  @DeleteDateColumn({
    name: 'deleted_at',
    transformer: {
      from: (e : any) => moment(e).format('YYYY-MM-DD HH:mm:ss'),
      to: (e : any) => {
        if(e) {
          return moment(e).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    } as any,
    default: null
  })
  deletedAt : Date
}