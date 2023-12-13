import db from '../config/database.js';

export async function createHoliday(cityId, day, month, year, name, type) {
    const query = `
        INSERT INTO services.holidays (created_at, status, city_id, day, month, year, name, type) values (now(), true, $1, $2, $3, $4, $5, $6)
    `;
  
    const {rows} = await db.query(query, [cityId, day, month, year, name, type]);
  
    return rows
}
