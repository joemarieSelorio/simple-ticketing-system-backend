import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/users.entity';
import { AuditLog } from '../audits/audits.entity';

@Entity({ name: 'tickets' })
export class Ticket {
  @Column()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  rejection_reason: string;

  @ManyToOne(() => User, (user) => user.createdTickets)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.assignedTickets, { nullable: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User;

  @OneToMany(() => AuditLog, (auditLog) => auditLog.ticket)
  auditLogs: AuditLog[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
