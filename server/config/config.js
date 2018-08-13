module.exports = {
  port: process.env.PORT || 8081,
  db: {
    database: process.env.SRL_DB_NAME || 'mol_inventory',
    user: process.env.LABIS_POSTGRES_DATABASE_USERNAME || 'postgres',
    password: process.env.LABIS_POSTGRES_DATABASE_PASSWORD || 'root',
    options: {
      dialect: process.env.DIALECT || 'postgres',
      host: process.env.SRL_INVENTORY_HOST || 'localhost'
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
