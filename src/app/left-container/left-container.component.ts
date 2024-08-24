import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faCloudRain} from '@fortawesome/free-solid-svg-icons';
import { WeatherAppService } from '../Services/weatherapp.service';

@Component({
  selector: 'app-left-container',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './left-container.component.html',
  styleUrl: './left-container.component.css'
})
export class LeftContainerComponent {
  //variable for font-awesome-icons nav bar
  faMagnifyingGlass:any = faMagnifyingGlass;
  faMapMarkerAlt:any=faMapMarkerAlt;
  //variable for font-awesome-icons left-conatiner-weather-summary
  faCloud:any=faCloud;
  faCloudRain:any=faCloudRain;

  constructor(public WeatherAppService:WeatherAppService){}
  onSearch(location:string){
    this.WeatherAppService.cityName = location;
    this.WeatherAppService.getData();
  }

}
