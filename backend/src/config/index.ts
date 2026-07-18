import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  node_env: process.env.NODE_ENV,
  dashboard_secret: process.env.DASHBOARD_SECRET,
  repo_unlock_password: process.env.REPO_UNLOCK_PASSWORD,
};
