class TodoRole {
    constructor({ id, task_id, user_id, role }) {
      this.id = id
      this.task_id = task_id
      this.user_id = user_id
      this.role = role
    }
  }
  
  module.exports = TodoRole