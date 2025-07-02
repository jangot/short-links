import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  Unique,
} from 'typeorm';
import { Visit } from './visit.entity';

@Entity('links')
@Index(['alias'])
@Unique('UQ_ALIAS', ['alias'])
@Index(['expiresAt'])
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalUrl: string;

  @Column({ nullable: true })
  alias: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @OneToMany(() => Visit, (visit) => visit.link)
  visits: Visit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
