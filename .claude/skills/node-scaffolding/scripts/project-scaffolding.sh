#!/bin/bash
# api-project-scaffolding.sh
# Script to scaffold a modern Node.js API application with Express, TypeScript, Jest, dotenv, and a joke endpoint

set -e

# Step 1: Initialize Node.js project
if [ ! -d "api" ]; then
  mkdir api
fi
cd api
if [ ! -f "package.json" ]; then
  npm init -y
fi

# Step 2: Install dependencies
npm install express cors dotenv
npm install --save-dev @types/node @types/express @types/cors
npm install --save-dev typescript ts-node @types/node
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest

# Step 3: Configure TypeScript
if [ ! -f "tsconfig.json" ]; then
  npx tsc --init
fi
cat > tsconfig.json <<EOL
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
EOL

# Step 4: Configure Jest
cat > jest.config.js <<EOL
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
EOL

# Step 5: Update package.json scripts
jq '.scripts = {"start": "node dist/index.js", "dev": "ts-node src/index.ts", "build": "tsc", "test": "jest --no-cache", "test:watch": "jest --watch"}' package.json > package.tmp.json && mv package.tmp.json package.json

# Step 6: Create src/index.ts
mkdir -p src
cat > src/index.ts <<EOL
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.status(200).send('OK');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
EOL

# Step 7: Create .env file
cat > .env <<EOL
PORT=3001
NODE_ENV=development
EOL

# Step 8: Create .gitignore
cat > .gitignore <<EOL
node_modules/
dist/
.env
coverage/
*.log
EOL

# Step 9: Add tailwind config
cat > tailwind.config.js <<EOL
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      pingfang: ['PingFangSC', 'sans-serif'],
    },
    extend: {
      screens: {
        xxs: '320px',
        xs: '768px',
        lg: '1286px',
      },
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        // Brand colors
        yellow: {
          5: '#FFFEE6',
          10: '#FFFCCC',
          20: '#FFFCAA',
          40: '#FFFB7F',
          60: '#FFFA55',
          80: '#FFF82B',
          scoot: '#FFF700',
        },
        gray: {
          5: '#F2F2F2',
          10: '#E6E6E6',
          20: '#CCCCCC',
          40: '#999999',
          60: '#666666',
          80: '#333333',
        },
        // Semantic colors
        error: {
          5: '#FDF6F7',
          20: '#F9D9E0',
          100: '#E04264',
        },
        warning: {
          5: '#FEF6F1',
          20: '#F7DCCF',
          100: '#E07742',
        },
        success: {
          5: '#F7FCF5',
          20: '#E1F5E3',
          100: '#6ECE79',
        },
        link: {
          40: '#A3C5F5',
          100: '#186ADE',
        },
        orange: {
          5: '#FFFCF3',
          20: '#FEF1CD',
          100: '#F9BA06',
        },
        kf: {
          5: '#F2F5F9',
          10: '#E5EAF3',
          40: '#99ACCF',
          80: '#33599F',
          100: '#003087',
        },
      },
      spacing: {
        0.25: '0.0625rem',
        0.5: '0.125rem',
        0.625: '0.15625rem',
        0.75: '0.1875rem',
        1: '0.25rem',
        1.25: '0.3125rem',
        1.75: '0.4375rem',
        2.5: '0.625rem',
        3.25: '0.8125rem',
        3.75: '0.9375rem',
        4.5: '1.125rem',
        5: '1.25rem',
        7.5: '1.875rem',
        12.5: '3.125rem',
        // ... additional spacing values
      },
      borderRadius: {
        xs: '0.5rem',
        s: '1rem',
        m: '1.5rem',
      },
      boxShadow: {
        default: '1px 1px 4px rgba(0, 0, 0, 0.1)',
        'profile-account-menu': '1px 1px 4px 1.2px rgba(0, 0, 0, 0.15)',
        'user-profile': '0px 0px 20px rgba(0, 0, 0, 0.15)',
      },
      zIndex: {
        modal: 9999,
      },
    },
  },
  plugins: [],
};
EOL

# Step 10: Create brand endpoint
mkdir -p src/brand
cat > src/brand/index.ts <<EOL
import { Router } from 'express';

const router = Router();

router.get('/api/brand', (req, res) => {
  res.status(200).json({ data: 'Scoot PTE LTD' });
});

export default router;
EOL

# Step 11: Add brand endpoint to main app
sed -i '' '/app.use(express.json());/a\
app.use(require("./brand").default);' src/index.ts

# Step 12: Create brand test
cat > src/brand/index.spec.ts <<EOL
import request from 'supertest';
import app from '../index';

describe('GET /api/brand', () => {
  it('should return the brand name', async () => {
    const response = await request(app).get('/api/brand');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: 'Scoot PTE LTD' });
  });
});
EOL

# Step 13: Test the application
npm run test

# Step 14: Build and run
npm run build
