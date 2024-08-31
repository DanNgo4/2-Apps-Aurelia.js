import { IRouter } from '@aurelia/router';
import { inject } from 'aurelia';

import { TodoApp } from "./routes/todo_app/todo-app";
import { WeatherApp } from "./routes/weather_app/weather-app";

@inject(IRouter)
export class MyApp {
  static routes = [
    {
      path: "",
      component: TodoApp,
      title: "Todo App"
    },
    {
      path: "/weather-app",
      component: WeatherApp,
      title: "Weather App"
    }
  ]
}
