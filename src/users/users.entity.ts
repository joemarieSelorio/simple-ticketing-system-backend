import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';
import { AuditLog } from '../audits/audits.entity';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Ticket, (ticket) => ticket.createdBy)
  createdTickets: Ticket[];
  
  @OneToMany(() => Ticket, (ticket) => ticket.assignedTo)
  assignedTickets: Ticket[];

  
  @OneToMany(() => AuditLog, (audit) => audit.performedBy)
  auditLogs: AuditLog[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
