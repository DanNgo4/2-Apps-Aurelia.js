import { IRouter } from '@aurelia/router';
import { inject } from 'aurelia';

import { Home } from "./routes/home/home";
import { TodoApp } from "./routes/todo_app/todo-app";
import { WeatherApp } from "./routes/weather_app/weather-app";

@inject(IRouter)
export class MyApp {
  static routes = [
    {
      path: "",
      component: Home,
      title: "Home Page"
    },
    {
      path: "/todo-app",
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
