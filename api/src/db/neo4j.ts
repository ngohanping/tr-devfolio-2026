import neo4j, { Driver, Session, QueryResult } from 'neo4j-driver';

let driver: Driver | null = null;

export const initializeNeo4j = async (): Promise<Driver> => {
  if (driver) return driver;

  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const user = process.env.NEO4J_USER || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'password';

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    maxConnectionLifetime: 30 * 60 * 1000,
  });

  try {
    const session = driver.session();
    await session.run('RETURN 1');
    await session.close();
    console.log('Neo4j connected successfully');
  } catch (error) {
    console.error('Failed to connect to Neo4j:', error);
    throw error;
  }

  return driver;
};

export const getSession = (): Session => {
  if (!driver) throw new Error('Neo4j driver not initialized');
  return driver.session();
};

export const getNeo4jDriver = (): Driver => {
  if (!driver) throw new Error('Neo4j driver not initialized');
  return driver;
};

export const closeNeo4j = async (): Promise<void> => {
  if (driver) {
    await driver.close();
    driver = null;
  }
};
