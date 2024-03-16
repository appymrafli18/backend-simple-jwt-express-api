import { Sequelize } from 'sequelize';

const db = new Sequelize('db_university', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
});

export default db;