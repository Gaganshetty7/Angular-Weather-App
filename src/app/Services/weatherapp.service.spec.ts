import { TestBed } from '@angular/core/testing';

import { WeatherAppService } from './weatherapp.service';

describe('WeatherAppService', () => {
  let service: WeatherAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
