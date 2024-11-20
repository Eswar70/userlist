// src/App.js
import { Component } from "react";
import axios from "axios";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

class App extends Component {
  state = {
    users: [],
    selectedUser: null,
    error: null,
  };

  componentDidMount() {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const formattedUsers = response.data.map((user) => ({
          id: user.id,
          firstName: user.name.split(" ")[0] || "",
          lastName: user.name.split(" ")[1] || "",
          email: user.email,
          department: "N/A", // Placeholder as JSONPlaceholder doesn't provide departments
        }));
        this.setState({ users: formattedUsers });
      })
      .catch(() => {
        this.setState({
          error: "Failed to fetch users. Please try again later.",
        });
      });
  }

  // src/App.js
  handleUserSubmit = (user) => {
    const { selectedUser, users } = this.state;

    if (selectedUser) {
      // Update an existing user
      axios
        .put(
          `https://jsonplaceholder.typicode.com/users/${selectedUser.id}`,
          user
        )
        .then((response) => {
          const updatedUsers = users.map((u) =>
            u.id === selectedUser.id ? response.data : u
          );
          this.setState({
            users: updatedUsers,
            selectedUser: null,
            error: null,
          });
        })
        .catch(() => this.setState({ error: "Failed to update user." }));
    } else {
      // Add a new user
      const nextId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1; // Calculate the next available ID
      const newUser = { ...user, id: nextId };

      axios
        .post("https://jsonplaceholder.typicode.com/users", newUser)
        .then((response) => {
          this.setState({
            users: [...users, { ...response.data, id: nextId }],
            error: null,
          });
        })
        .catch(() => this.setState({ error: "Failed to add user." }));
    }
  };

  handleEditUser = (user) => {
    this.setState({ selectedUser: user });
  };

  handleDeleteUser = (userId) => {
    const { users } = this.state;
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(() => {
        const updatedUsers = users.filter((user) => user.id !== userId);
        this.setState({ users: updatedUsers, error: null });
      })
      .catch(() => this.setState({ error: "Failed to delete user." }));
  };

  render() {
    const { users, selectedUser, error } = this.state;

    return (
      <ErrorBoundary>
        <div className="App">
          <h1>User Management</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <UserForm
            onSubmit={this.handleUserSubmit}
            selectedUser={selectedUser}
          />
          <UserList
            users={users}
            onEdit={this.handleEditUser}
            onDelete={this.handleDeleteUser}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
