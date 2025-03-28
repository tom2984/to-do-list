//constructors for projects

export class Projects {
    constructor(name, todos = []) {
        this.name = name;
        this.todos = todos;
        this.id = crypto.randomUUID();
    }
}