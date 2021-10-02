class Task {
  constructor({ task_id, todo_id, title, description, updated_by, due_date, is_completed, is_deleted }) {
    this.task_id = task_id
    this.todo_id = todo_id
    this.title = title
    this.description = description
    this.updated_by = updated_by
    this.due_date = due_date
    this.is_completed = is_completed
    this.is_deleted = is_deleted
  }
}

module.exports = Task