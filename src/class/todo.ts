export class Todo {
    name: string;
    description: string;
    time: Date;
    finished: boolean;

    constructor(name, description, time) {
        this.name = name;
        this.description = description;
        this.time = time;
        this.finished = false;
    }
}