class User {
  constructor({ id, username, email, password_hash }) {
    this.id = id
    this.username = username
    this.email = email
    this.password_hash = password_hash
  }
}

module.exports = User