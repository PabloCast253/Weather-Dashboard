import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Convert __dirname since it's not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/searchHistory.json");

// ✅ Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {}
}

// ✅ Complete the HistoryService class
class HistoryService {
  private filePath = filePath; // ✅ Corrected file path usage

  // ✅ Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      console.log("Attempting to read search history from:", this.filePath);

      // ✅ Ensure file exists
      try {
        await fs.access(this.filePath);
      } catch {
        console.warn("searchHistory.json not found, creating a new one...");
        await fs.writeFile(this.filePath, "[]", "utf-8"); // ✅ Create empty file if missing
      }

      // ✅ Read file content
      const data = await fs.readFile(this.filePath, "utf-8");
      console.log("Raw search history file content:", data);

      return JSON.parse(data) || [];
    } catch (error) {
      console.error("Error reading searchHistory.json:", error);
      return []; // ✅ Prevents crashing by returning an empty array
    }
  }

  // ✅ Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), "utf-8");
    } catch (error) {
      console.error("Error writing to searchHistory.json:", error);
    }
  }

  // ✅ Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    try {
      console.log("Reading search history...");
      const history = await this.read();
      console.log("Search history data:", history);
      return history;
    } catch (error) {
      console.error("Error reading search history:", error);
      return []; // ✅ Prevents crashing by returning an empty array
    }
  }

  // ✅ Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<City> {
    try {
      const cities = await this.read();
      const newCity = new City(city, Math.random().toString(36).slice(2, 11)); // ✅ Fixed `substr()`
      cities.push(newCity);
      await this.write(cities);
      return newCity;
    } catch (error) {
      console.error("Error adding city to search history:", error);
      throw error;
    }
  }

  // ✅ Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<boolean> {
    try {
      const cities = await this.read();
      const filteredCities = cities.filter(city => city.id !== id);

      if (filteredCities.length === cities.length) return false; // ✅ No city removed

      await this.write(filteredCities);
      return true;
    } catch (error) {
      console.error("Error removing city from search history:", error);
      throw error;
    }
  }
}

export default new HistoryService();
