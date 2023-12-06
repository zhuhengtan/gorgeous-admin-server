import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    CreateDateColumn,
    DeleteDateColumn,
  } from 'typeorm'
  import moment from 'moment'
  
  export enum UserStatus {
    Unknown = 0,
    Normal = 1,
    Banned = 2,
  }
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number
  
    @Column({
      name: 'nickname',
      type: 'varchar',
      comment: '昵称',
    })
    nickname: string
  
    @Column({
      name: 'avatar',
      type: 'varchar',
      comment: '头像',
    })
    avatar: string
  
    @Column({
      name: 'status',
      type: 'tinyint',
      comment: '用户状态  1正常 2已禁用',
      default: 1,
    })
    status: UserStatus
  
    @Column({
      name: 'phone',
      type: 'varchar',
      comment: '手机号',
      select: false,
    })
    phone: string
  
    @Column({
      name: 'self_introduction',
      type: 'varchar',
      comment: '自我介绍',
      default: '',
    })
    selfIntroduction: string
  
    @Column({
      name: 'real_name',
      type: 'varchar',
      nullable: true,
      comment: '实名',
      select: false,
    })
    realName: string
  
    @Column({
      name: 'id_number',
      type: 'varchar',
      nullable: true,
      comment: '身份证号',
      select: false,
    })
    idNumber: string
  
    @Column({
      name: 'gender',
      type: 'tinyint',
      comment: '性别，0保密 1男 2女',
      default: 0,
    })
    gender: number
  
    @Column({
      name: 'invite_code',
      type: 'varchar',
      comment: '邀请码',
      default: '',
    })
    inviteCode: string
  
    @Column({
      name: 'job',
      type: 'varchar',
      comment: '职业，自己填写',
      default: '',
    })
    job: string
  
    @Column({
      name: 'wechat',
      type: 'varchar',
      comment: '微信',
      default: '',
      select: false,
    })
    wechat: string
  
    @CreateDateColumn({
      name: 'created_at',
      transformer: {
        from: (e: any) => moment(e).format('YYYY-MM-DD HH:mm:ss'),
        to: (e: any) => moment(e).format('YYYY-MM-DD HH:mm:ss'),
      } as any,
    })
    createdAt: Date
  
    @DeleteDateColumn({
      name: 'deleted_at',
      select: false,
      transformer: {
        from: (e: any) => {
          if(e) {
            return moment(e).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        to: (e: any) => {
          if (e) {
            return moment(e).format('YYYY-MM-DD HH:mm:ss')
          }
        },
      } as any,
      default: null,
    })
    deletedAt: Date
  }
  