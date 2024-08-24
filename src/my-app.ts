import { Todo } from "./class/todo";

import { todoList } from "./assets/todo-list";

export class MyApp {
  h1: string;
  todos: Array<Todo>;
  todoName: string;
  todoDescription: string;
  todoTime: string;
  finishedTodos: Array<Todo>;
  overdueTodos: Array<Todo>;

  currentPage: number;
  itemsPerPage: number;

  constructor() {
    this.h1 = "My Todo List";
    this.todos = todoList;
    this.todoName = "";
    this.todoDescription = "";
    this.todoTime = "";
    this.finishedTodos = [];
    this.overdueTodos = [];

    this.currentPage = 1;
    this.itemsPerPage = 4;

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

  get totalPages(): number {
    return Math.ceil(this.todos.length / this.itemsPerPage);
  }

  get paginatedTodos(): Array<Todo> {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.todos.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get visiblePages(): number[] {
    const pages = [];
    const prevPage = Math.max(1, this.currentPage - 1);
    const nextPage = Math.min(this.totalPages, this.currentPage + 1);

    // First page always visible
    if (prevPage > 2) {
      pages.push(1);
    }

    // Add ... as gap on the left
    if (prevPage > 2) {
      pages.push(null); 
    }

    // Add previous, current and next pages
    for (let i = prevPage; i <= nextPage; i++) {
      pages.push(i);
    }

    // Add ... as gap on the right
    if (nextPage < this.totalPages - 1) {
      pages.push(null); 
    }

    // Last page always visible
    if (nextPage < this.totalPages) {
      pages.push(this.totalPages);
    }

    return pages;
  }
}
