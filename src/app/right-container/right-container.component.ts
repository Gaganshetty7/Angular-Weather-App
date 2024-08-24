import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherAppService } from '../Services/weatherapp.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-right-container',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './right-container.component.html',
  styleUrls: ['./right-container.component.css']
})
export class RightContainerComponent {
  
  constructor(public WeatherAppService:WeatherAppService){};

  //function to control navbar-tab states
  onTodayClick(){
    this.WeatherAppService.today=true;
    this.WeatherAppService.week=false;
  }

  onWeekClick(){
    this.WeatherAppService.today=false;
    this.WeatherAppService.week=true;
  }

  //function to control navbar-metrics
  onCelsiusClick(){
    this.WeatherAppService.celsius=true;
    this.WeatherAppService.fahrenheit=false;
  }

  onFahrenheitClick(){
    this.WeatherAppService.celsius=false;
    this.WeatherAppService.fahrenheit=true;
  }
}

