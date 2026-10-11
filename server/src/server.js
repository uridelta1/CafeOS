import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDemoData } from './utils/seed.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: resolve(currentDir, '.env'),
});

const PORT = Number(process.env.PORT) || 5000;

try {
  await connectDB();
  await seedDemoData();

  app.listen(PORT, () => {
    console.log(`CafeOS API running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Server startup failed:', error.message);
  process.exit(1);
}
