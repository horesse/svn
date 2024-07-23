import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrl   : './app.component.scss',
  imports    : [RouterOutlet],
  standalone : true
})
export class AppComponent {

  /**
   * Конструктор
   */
  constructor() {
  }
}
