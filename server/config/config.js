module.exports = {
  port: process.env.PORT || 8081,
  host: process.env.HOST || "localhost",

  db: {
    database: process.env.SRL_DB_NAME || 'mol_inventory',
    user: process.env.LABIS_POSTGRES_DATABASE_USERNAME || 'postgres',
    password: process.env.LABIS_POSTGRES_DATABASE_PASSWORD || 'root',
    options: {
      dialect: process.env.DIALECT || 'postgres',
      host: process.env.SRL_INVENTORY_HOST || 'localhost',
      port: process.env.SRL_INVENTORY_DB_PORT || '5432',
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
