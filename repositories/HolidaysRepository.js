import db from '../config/database.js';

export async function createHoliday(cityId, day, month, year, name, type) {
    const query = `
        INSERT INTO services.holidays (created_at, status, city_id, day, month, year, name, type) values (now(), true, $1, $2, $3, $4, $5, $6)
    `;
  
    const {rows} = await db.query(query, [cityId, day, month, year, name, type]);
  
    return rows
}

export async function findHoliday(day, month, year, cityId) {
    const query = `
      SELECT * FROM services.holidays
      WHERE day = $1 AND month = $2 AND year = $3 AND city_id = $4
    `;
  
    const {rows} = await db.query(query, [day, month, year, cityId]);
  
    return rows
}
