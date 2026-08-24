import dns from 'node:dns';
import mongoose from 'mongoose';
import app from './app';
import config from './config';

// Fallback to public DNS to resolve SRV records on Windows networks if default ISP DNS fails
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Ignore DNS setServers errors if not supported in environment
}

async function main() {
  const port = config.port || 5000;

  // Start Express server
  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server is running on port ${port}`);
  });

  // Connect to MongoDB
  if (!config.db_url) {
    // eslint-disable-next-line no-console
    console.error('❌ DB_URL is missing in backend/.env');
    return;
  }

  try {
    await mongoose.connect(config.db_url as string);
    // eslint-disable-next-line no-console
    console.log('✅ MongoDB connected successfully');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.error(
      `❌ MongoDB connection error: ${errorMsg}\n👉 Please verify that your MongoDB cluster is active and your DB_URL in backend/.env is correct.`
    );
  }

  process.on('unhandledRejection', (error) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled Rejection:', error);
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

