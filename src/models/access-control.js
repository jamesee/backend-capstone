class AccessControl {
    constructor({ access_id, todo_id, user_id, role }) {
      this.access_id = access_id
      this.todo_id = todo_id
      this.user_id = user_id
      this.role = role
    }
  }
  
  module.exports = AccessControl