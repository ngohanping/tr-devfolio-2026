import { Service, Team } from '../models';

export const mockServices: Map<string, Service> = new Map([
  ['1', {
    id: '1',
    name: 'User Service',
    type: 'SERVICE',
    description: 'Handles user authentication and profile management',
    status: 'active',
    teamId: '1',
    tags: ['REST', 'v2.0'],
    version: 'v2.0',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-04-20'),
  }],
  ['2', {
    id: '2',
    name: 'PostgreSQL Database',
    type: 'DATABASE',
    description: 'Primary database for user and project data',
    status: 'active',
    teamId: '1',
    tags: ['Production'],
    version: 'v13',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-05'),
  }],
  ['3', {
    id: '3',
    name: 'Analytics Worker',
    type: 'WORKER',
    description: 'Background job processor for analytics',
    status: 'active',
    teamId: '2',
    tags: ['async', 'batch'],
    version: 'v1.2',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-04-18'),
  }],
  ['4', {
    id: '4',
    name: 'Cache Layer',
    type: 'PROPOSED',
    description: 'Redis-based caching solution',
    status: 'proposed',
    teamId: '2',
    tags: ['redis', 'performance'],
    version: 'v0.1',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-10'),
  }],
]);

export const mockTeams: Map<string, Team> = new Map([
  ['1', {
    id: '1',
    name: 'Platform Team',
    description: 'Core platform infrastructure and services',
    lead: 'Alice Johnson',
    members: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2024-04-15'),
  }],
  ['2', {
    id: '2',
    name: 'Data Team',
    description: 'Analytics and data pipeline',
    lead: 'David Chen',
    members: ['David Chen', 'Emma Wilson', 'Frank Brown'],
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-04-10'),
  }],
  ['3', {
    id: '3',
    name: 'Frontend Team',
    description: 'Web and mobile frontend applications',
    lead: 'Grace Lee',
    members: ['Grace Lee', 'Henry Park'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-04-20'),
  }],
]);

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
