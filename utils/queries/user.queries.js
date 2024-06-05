const { pool } = require("../db/index");

const findUserByEmail = async (email) => {
  const {
    rows: [user],
  } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return user;
};

const findUserByID = async (id) => {
  const {
    rows: [user],
  } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return user;
};

const createUser = async ({ name, email, password }) => {
  const {
    rows: [user],
  } = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, password]);
  return user;
};

const deleteUserByID = async (id) => {
  const {
    rows: [user],
  } = await pool.query("UPDATE users SET IS_DELETED = $1 WHERE id = $2 RETURNING *", [true, id]);
  return user;
};

const deleteUserByEmail = async (email) => {
  const {
    rows: [user],
  } = await pool.query("UPDATE users SET IS_DELETED = $1 WHERE email = $2 RETURNING *", [true, email]);
  return user;
};

module.exports = { findUserByEmail, findUserByID, createUser, deleteUserByEmail, deleteUserByID };
