import sql from 'mssql';

const config = {
  user: 'sa',                    // Hoặc username SQL Server của bạn
  password: '123456a@',     // Password SQL Server
  server: '113.160.202.36',           // Địa chỉ server
  database: 'form',              // Tên database
  port: 1999,                    // Port mặc định của SQL Server
  options: {
    encrypt: false,              // Đặt false cho local development
    trustServerCertificate: true,
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

export async function connectDB() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('Connected to SQL Server');
    }
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export { sql };
