import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'delivery_routes_db',
  password: 'root',
  port: 5432,
});

export default pool;