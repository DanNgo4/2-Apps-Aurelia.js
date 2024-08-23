import { Todo } from "./interface/todo";

export class MyApp {
  h1: string;
  todos: Array<Todo>;
  todoName: string;
  todoDescription: string;
  todoTime: string;
  finishedTodos: Array<Todo>;
  overdueTodos: Array<Todo>;

  constructor() {
    this.h1 = "My Todo List";
    this.todos = [
      new Todo("Buy groceries", "Buy eggs, milk, butter", new Date()),
      new Todo("Complete homework", "Finish DSA assignment", new Date()),
      new Todo("Go to the gym", "Leg day", new Date(new Date().getTime() + 86400000))
    ];
    this.todoName = "";
    this.todoDescription = "";
    this.todoTime = "";
    this.finishedTodos = [];
    this.overdueTodos = [];

    setInterval(() => this.checkOverdueTasks(), 1000);
  }

  addTodo(): void {
    const name = this.todoName.trim();
    const description = this.todoDescription.trim();
    const time = new Date(this.todoTime);

    if (name && time) {
      const newTodo = new Todo(name, description, time);
      this.todos.push(newTodo);

      this.todoName = "";
      this.todoDescription = "";
      this.todoTime = "";
    }
  }

  finishTodo(todo: Todo, list: string = ""): void {
    todo.finished = true;

    if (list === "overdueTodos") {
      this.overdueTodos = this.overdueTodos.filter(t => t !== todo);
    } else {
      this.todos = this.todos.filter(t => t !== todo);
    }

    this.finishedTodos.push(todo);
  }

  checkOverdueTasks(): void {
    const now = new Date();
    const newTodos = [];
    
    for (const todo of this.todos) {
      if (todo.time < now) {
        this.overdueTodos.push(todo); // Add to overdue tasks
      } else {
        newTodos.push(todo); // Keep the non-overdue tasks
      }
    }
    
    this.todos = newTodos;
  }

  removeTodo(todo: Todo, list: string): void {
    switch (list) {
      case 'todos':
        this.todos = this.todos.filter(t => t !== todo);
        break;
      case 'finishedTodos':
        this.finishedTodos = this.finishedTodos.filter(t => t !== todo);
        break;
      case 'overdueTodos':
        this.overdueTodos = this.overdueTodos.filter(t => t !== todo);
        break;
      default:
        console.error('Invalid list specified for removal');
    }
  }  

  recoverTodo(todo: Todo): void {
    this.todos.push(todo);
    this.finishedTodos = this.finishedTodos.filter(t => t !== todo);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  }
}
