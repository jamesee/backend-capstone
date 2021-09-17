class Todo {
    constructor({ id, task_name, description, complete, due_date, updated_by }) {
      this.id = id
      this.task_name = task_name
      this.description = description
      this.complete = complete
      this.due_date = due_date
      this.updated_by = updated_by
    }
  }
  
  module.exports = Todo