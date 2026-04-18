import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseAsync("recipes1.db");

export const initDB = async () => {
  const database = await db;

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      idMeal TEXT PRIMARY KEY,
      strMeal TEXT,
      strMealThumb TEXT,
      strArea TEXT,
      strCategory TEXT,
      strInstructions TEXT,
      strTags TEXT,
      ingredients TEXT
    );`);
};
