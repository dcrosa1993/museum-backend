import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ArticleStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DELETED = 'deleted',
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'text',
    array: true,
    default: '{}',
  })
  images: string[];

  @Column({
    type: 'varchar',
    length: 100,
  })
  category: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.PENDING,
  })
  status: ArticleStatus;

  @Column({
    type: 'boolean',
    default: false,
  })
  favorite: boolean;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  createdBy: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  updatedBy: string | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
