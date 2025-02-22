import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Ticket } from '../tickets/ticket.entity';

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @Column()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  action: string;

  @ManyToOne(() => User, (user) => user.auditLogs)
  @JoinColumn({ name: 'user_id' })
  performedBy: User;

  @ManyToOne(() => Ticket, (ticket) => ticket.auditLogs)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
