import db from '../config/database.js';

export async function findCity(state, city) {
  const query = `
    SELECT * FROM services.cities
    WHERE state = $1 AND name = $2
  `;

  const {rows} = await db.query(query, [state, city]);

  return rows
}