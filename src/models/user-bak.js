class User {
  constructor({ id, username, password_hash }) {
    this.id = id
    this.username = username
    this.password_hash = password_hash
  }
}

module.exports = User
