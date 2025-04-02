import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
// ✅ Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public temperature: number,
    public humidity: number,
    public windSpeed: number,
    public description: string,
    public icon: string
  ) {}
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.WEATHER_API_KEY || '';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    console.log("Fetching location data from:", url); // ✅ Debugging log
    console.log("Using API Key:", this.apiKey ? "Present" : "Missing!!!!!!!!"); // ✅ Check if API key is missing
    const response = await fetch(url);
    const data = await response.json();
  
    if (!data || data.length === 0) {
      throw new Error(`Location not found for: ${query}`);
    }
  
    return data;
  }
  
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any[]): Coordinates {
    if (!locationData.length) throw new Error('Location not found');
    return { lat: locationData[0].lat, lon: locationData[0].lon };
  }

  // // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(city: string): string {
  //   return `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
  // }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    try {
      const locationData = await this.fetchLocationData(city);
      return this.destructureLocationData(locationData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve weather data: ${error.message}`);
      } else {
        throw new Error('Failed to retrieve weather data');
      }
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    return response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { name } = response.city;
    const { temp, humidity } = response.list[0].main;
    const { speed: windSpeed } = response.list[0].wind;
    const { description, icon } = response.list[0].weather[0];

    return new Weather(name, temp, humidity, windSpeed, description, icon);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const dailyForecasts: Weather[] = [];
  
    const usedDates = new Set();
  
    for (const entry of weatherData) {
      const date = entry.dt_txt.split(' ')[0];
      const time = entry.dt_txt.split(' ')[1];
  
      if (time === '12:00:00' && !usedDates.has(date)) {
        usedDates.add(date);
        dailyForecasts.push(
          new Weather(
            currentWeather.city,
            entry.main.temp,
            entry.main.humidity,
            entry.wind.speed,
            entry.weather[0].description,
            entry.weather[0].icon
          )
        );
      }
  
      if (dailyForecasts.length === 5) break;
    }
  
    return dailyForecasts;
  }
  
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] } | null> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
  
      if (!weatherData || !weatherData.list || weatherData.list.length === 0) {
        return null; // ✅ Return null instead of throwing an error
      }
  
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecast = this.buildForecastArray(currentWeather, weatherData.list);
      return { current: currentWeather, forecast };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error in getWeatherForCity: ${error.message}`);
      } else {
        console.error('Error in getWeatherForCity: Unknown error');
      }
      return null; // ✅ Return null instead of an error
    }
  }
}

export default new WeatherService();
