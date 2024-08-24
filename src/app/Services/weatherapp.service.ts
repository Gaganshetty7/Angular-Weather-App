import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocationInfo } from '../Models/LocationInfo';
import { WeatherForecast } from '../Models/WeatherForecast';
import { LeftContainerData } from '../Models/LeftContainerData';
import { TodaysHighlight } from '../Models/TodaysHighlight';
import { TodayData } from '../Models/TodayData';
import { WeekData } from '../Models/WeekData';
import { Observable } from 'rxjs';
import { EnvironmentVariables } from '../Environment/EnvironmentVariables';
@Injectable({
  providedIn: 'root'
})
export class WeatherAppService {

  //variable of api endpoints 
  locationInfo?: LocationInfo;
  weatherForecast?: WeatherForecast;

  // variables that has extracted data from api endpoint variables
  leftContainerData: LeftContainerData;
  todaysHighlightData: TodaysHighlight;
  todayData?: TodayData[];
  weekData?: WeekData[];

  //api calls variables
  cityName: string = "Mangaluru";
  language: string = "en-US";
  date: string = "20240818"
  units: string = "m";

  //variable for current time
  currentTime: Date = new Date();

  // variables of navbar-tabs
  today:boolean = true;
  week:boolean = false;

  // variables of navbar-metrics
  celsius:boolean = true;
  fahrenheit:boolean = false;

  constructor(private httpClient: HttpClient) {
    this.getData();
  }

  //function for temperature image of leftContainerData
  getSummaryImage(summary: string): string {
    const noimg = "assets/noimg.png";
    const sunny = "assets/mostly_sunny.png";
    const mostlySunny = "assets/mostly_sunny.png";
    const partlySunny = "assets/sunny.png";
    const partlyCloudy = "assets/sunny.png";
    const mostlyCloudy = "assets/mostly_cloudy.png";
    const cloudy = "assets/cloudy.png";
    const overcast = "assets/mostly_cloudy.png";
    const showers = "assets/showers.png";
    const rain = "assets/rain.png";
    const thunderstorms = "assets/thunderstorms.png";
    const snow = "assets/snow.png";
    const lightSnow = "assets/snow.png";
    const heavySnow = "assets/snow.png";
    const sleet = "assets/sleet.png";
    const freezingRain = "assets/sleet.png";
    const hail = "assets/hail.png";
    const fog = "assets/fog.png";
    const mist = "assets/fog.png";
    const haze = "assets/fog.png";
    const smoke = "assets/fog.png";
    const windy = "assets/windy.png";

    if (summary.includes("Sunny")) return sunny;
    else if (summary.includes("Mostly Sunny")) return mostlySunny;
    else if ((summary.includes("Partly Sunny")) || (summary.includes("sun"))) return partlySunny;
    else if (summary.includes("Partly Cloudy")) return partlyCloudy;
    else if (summary.includes("Mostly Cloudy")) return mostlyCloudy;
    else if (summary.includes("Cloudy")) return cloudy;
    else if (summary.includes("Overcast")) return overcast;
    else if (summary.includes("Showers")) return showers;
    else if ((summary.includes("Rain")) || (summary.includes("rain"))) return rain;
    else if (summary.includes("Thunderstorms")) return thunderstorms;
    else if (summary.includes("Snow")) return snow;
    else if (summary.includes("Light Snow")) return lightSnow;
    else if (summary.includes("Heavy Snow")) return heavySnow;
    else if (summary.includes("Sleet")) return sleet;
    else if (summary.includes("Freezing Rain")) return freezingRain;
    else if (summary.includes("Hail")) return hail;
    else if (summary.includes("Fog")) return fog;
    else if (summary.includes("Mist")) return mist;
    else if (summary.includes("Haze")) return haze;
    else if (summary.includes("Smoke")) return smoke;
    else if (summary.includes("Windy")) return windy;
    else return noimg;
  }

  //function to assign airquality phrase
  getAirQualityPhrase(airquality:number):string{
    if(airquality<=50) return "Good";
    else if(airquality<=100) return "Moderate";
    else if(airquality<=150) return "USG";
    else if(airquality<=200) return "Unhealthy";
    else if(airquality<=300) return "V.Unhealthy";
    else if(airquality>=150) return "Hazardous";

    return "Unknown";
  }

  //function to assign airquality phrase
  getVisibiltyPhrase(visibility:number):string{
    if(visibility<=1.6) return "Poor";
    else if(visibility<=4.8) return "Bad";
    else if(visibility<=9.7) return "Average";
    else if(visibility<=16) return "Good";
    else if(visibility>16) return "Excellent";

    return "Unknown";
  }

  //function to assign airquality phrase
  getHumidityPhrase(humidity:number):string{
    if(humidity<=20) return "Low";
    else if(humidity<=60) return "Normal";
    else if(humidity<=100) return "High";

    return "Unknown";
  }

  //calccc
  calculateRotation(uvIndex: number): number {
    // Convert UV index to a rotation value (0 to 1 turn)
    return uvIndex / 10 * 0.5; // Assuming UV Index ranges from 0 to 10
  }

  //method to fill the leftcontainer by assigning values to leftContainerData Model properties
  fillLeftContainerDataModel() {
    this.leftContainerData.temperature = this.weatherForecast['v3-wx-observations-current'].temperature;
    this.leftContainerData.day = this.weatherForecast['v3-wx-observations-current'].dayOfWeek;
    this.leftContainerData.time = this.weatherForecast['v3-wx-observations-current'].validTimeLocal.slice(11,16);
    this.leftContainerData.weatherSummary = this.weatherForecast['v3-wx-observations-current'].wxPhraseMedium;
    this.leftContainerData.tempImage = this.getSummaryImage(this.leftContainerData.weatherSummary);
    this.leftContainerData.rainPercentage = this.weatherForecast.vt1runweatherhourly.precipPct[0] !== null ? this.weatherForecast.vt1runweatherhourly.precipPct[0] : "N/A";

    this.leftContainerData.location = `${this.locationInfo.location.city[0]},${this.locationInfo.location.country[0]}`;
  }

  //method to fill the rightcontainer week tab by assigning values to WeekData Model properties
  fillWeekDataModel() {
    var weekCount = 0;
    while (weekCount < 7) {
      this.weekData.push(new WeekData());
      this.weekData[weekCount].day = this.weatherForecast['v3-wx-forecast-daily-15day'].dayOfWeek[weekCount].slice(0, 3);
      this.weekData[weekCount].tempMax = this.weatherForecast['v3-wx-forecast-daily-15day'].temperatureMax[weekCount] !== null ? this.weatherForecast['v3-wx-forecast-daily-15day'].temperatureMax[weekCount]:NaN;
      this.weekData[weekCount].tempMin = this.weatherForecast['v3-wx-forecast-daily-15day'].temperatureMin[weekCount] !== null ? this.weatherForecast['v3-wx-forecast-daily-15day'].temperatureMin[weekCount]:NaN;
      this.weekData[weekCount].tempImage = this.getSummaryImage(this.weatherForecast['v3-wx-forecast-daily-15day'].narrative[weekCount]);

      weekCount++;
    }
  }

  //method to fill the rightcontainer week tab by assigning values to TodayData Model properties
  fillTodayDataModel() {
    var todayCount = 0;
    while (todayCount < 7) {
      this.todayData.push(new TodayData());
      this.todayData[todayCount].time = this.weatherForecast['v3-wx-forecast-hourly-10day'].validTimeLocal[todayCount].slice(11, 16);
      this.todayData[todayCount].tempImage = this.getSummaryImage(this.weatherForecast['v3-wx-forecast-hourly-10day'].wxPhraseLong[todayCount]);
      this.todayData[todayCount].temperature = this.weatherForecast['v3-wx-forecast-hourly-10day'].temperature[todayCount] !== null ? this.weatherForecast['v3-wx-forecast-hourly-10day'].temperature[todayCount]:NaN;
      
      todayCount++;
    }
  }

  //method to fill the rightcontainer todayhighlights by assigning values to TodaysHighlights Model properties
  fillTodaysHighlightDataModel() {
    this.todaysHighlightData.uvIndex = this.weatherForecast['v3-wx-observations-current'].uvIndex !== null ?this.weatherForecast['v3-wx-observations-current'].uvIndex: NaN;
    this.todaysHighlightData.windSpeed = this.weatherForecast['v3-wx-observations-current'].windSpeed !== null ?this.weatherForecast['v3-wx-observations-current'].windSpeed.toString(): "N/A";;
    this.todaysHighlightData.sunrise = this.weatherForecast['v3-wx-observations-current'].sunriseTimeLocal.slice(11,16);
    this.todaysHighlightData.sunset = this.weatherForecast['v3-wx-observations-current'].sunsetTimeLocal.slice(11,16);
    
    this.todaysHighlightData.humidity = this.weatherForecast['v3-wx-observations-current'].relativeHumidity ?this.weatherForecast['v3-wx-observations-current'].relativeHumidity: NaN;
    this.todaysHighlightData.humidityPhrase = this.getHumidityPhrase(this.todaysHighlightData.humidity);
    
    this.todaysHighlightData.visibility = this.weatherForecast['v3-wx-observations-current'].visibility ?this.weatherForecast['v3-wx-observations-current'].visibility: NaN;
    this.todaysHighlightData.visibilityPhrase = this.getVisibiltyPhrase(this.todaysHighlightData.visibility);
    
    this.todaysHighlightData.airQuality = this.weatherForecast['v3-wx-globalAirQuality'].globalairquality.airQualityIndex !== null ? this.weatherForecast['v3-wx-globalAirQuality'].globalairquality.airQualityIndex : NaN;
    this.todaysHighlightData.airQualityPhrase = this.getAirQualityPhrase(this.todaysHighlightData.airQuality);

    this.todaysHighlightData.rotation = this.calculateRotation(this.todaysHighlightData.uvIndex);
    
  }
  //method to create useful data chunks to send to parts of UI
  prepareData(): void {
    //setting leftContainerData Model properties
    this.fillLeftContainerDataModel();
    this.fillWeekDataModel();
    this.fillTodayDataModel();
    this.fillTodaysHighlightDataModel();
    console.log(this.leftContainerData);
    console.log(this.weekData);
    console.log(this.todayData);
    console.log(this.todaysHighlightData);
  }

  //methods to convert celsius to fahrenheit and vice versa
  celsiusToFahrenheit(celsius:number):number{
    return Math.round(celsius*1.8) + 32;
  }

  fahrenheitToCelsius(fahrenheit:number):number{
    return Math.round(fahrenheit - 32) * 1.8;
  }

  //method to get location details from the api
  getLocationData(cityName: string, language: string): Observable<LocationInfo> {

    return this.httpClient.get<LocationInfo>(EnvironmentVariables.locationSearchBaseUrl, {
      headers: new HttpHeaders()
        .set(EnvironmentVariables.xRapidApiKeyName, EnvironmentVariables.xRapidApiKeyValue)
        .set(EnvironmentVariables.xRapidApiHostName, EnvironmentVariables.xRapidApiHostNameValue),
      params: new HttpParams()
        .set('query', cityName)
        .set('language', language)
    })

  }
  //method to get weather forecast details from the api
  getWeatherReport(date: string, language: string, latitude: number, longitude: number, units: string): Observable<WeatherForecast> {

    return this.httpClient.get<WeatherForecast>(EnvironmentVariables.weatherForecastBaseUrl, {
      headers: new HttpHeaders()
        .set(EnvironmentVariables.xRapidApiKeyName, EnvironmentVariables.xRapidApiKeyValue)
        .set(EnvironmentVariables.xRapidApiHostName, EnvironmentVariables.xRapidApiHostNameValue),
      params: new HttpParams()
        .set('date', date)
        .set('language', language)
        .set('latitude', latitude)
        .set('longitude', longitude)
        .set('units', units)
    });
  }


  getData() {
    this.leftContainerData = new LeftContainerData();
    this.todayData = [];
    this.weekData = [];
    this.todaysHighlightData = new TodaysHighlight();
    var latitude = 0;
    var longitude = 0;
    this.getLocationData(this.cityName, this.language).subscribe({
      next: (response) => {
        this.locationInfo = response;
        latitude = this.locationInfo?.location.latitude[0];
        longitude = this.locationInfo?.location.longitude[0];
        // console.log(this.locationInfo);

        //getting latitude and longitude for getWeatherReport
        this.getWeatherReport(this.date, this.language, latitude, longitude, this.units).subscribe({
          next: (response) => {
            this.weatherForecast = response;
            // console.log(this.weatherforecast);

            this.prepareData();
          }
        });
      }
    });


  }

}