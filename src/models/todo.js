class Todo {
    constructor({ todo_id, title, updated_by, due_date, is_completed, is_deleted}) {
      this.todo_id = todo_id
      this.title = title
      this.updated_by = updated_by
      this.due_date = due_date
      this.is_completed = is_completed
      this.is_deleted = is_deleted
    }
  }
  
  module.exports = Todo