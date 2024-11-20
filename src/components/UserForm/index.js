import { Component } from "react";

class UserForm extends Component {
  state = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    errorMessage: "",
  };

  componentDidUpdate(prevProps) {
    const { selectedUser } = this.props;
    if (prevProps.selectedUser !== selectedUser && selectedUser) {
      this.setState({ ...selectedUser, errorMessage: "" });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, errorMessage: "" });
  };

  validateForm = () => {
    const { firstName, lastName, email, department } = this.state;
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !department.trim()
    ) {
      this.setState({ errorMessage: "All fields are required." });
      return false;
    }
    return true;
  };

  isDataUnchanged = () => {
    const { selectedUser } = this.props;
    const { id, firstName, lastName, email, department } = this.state;

    if (
      selectedUser &&
      id === selectedUser.id &&
      firstName === selectedUser.firstName &&
      lastName === selectedUser.lastName &&
      email === selectedUser.email &&
      department === selectedUser.department
    ) {
      this.setState({
        errorMessage: "No changes detected. Please edit the fields.",
      });
      return true;
    }

    return false;
  };

  handleSubmit = (e) => {
    const { selectedUser, onSubmit } = this.props;
    e.preventDefault();

    if (!this.validateForm()) {
      return; // Stop submission if validation fails
    }

    if (selectedUser && this.isDataUnchanged()) {
      return; // Stop submission if no changes were made
    }

    const { id, firstName, lastName, email, department } = this.state;

    onSubmit({ id, firstName, lastName, email, department });

    this.setState({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      errorMessage: "",
    });
  };

  render() {
    const { firstName, lastName, email, department, errorMessage } = this.state;
    const { selectedUser } = this.props;

    return (
      <div>
        <h2>{selectedUser ? "Edit User" : "Add User"}</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="firstName"
            value={firstName}
            placeholder="First Name"
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="lastName"
            value={lastName}
            placeholder="Last Name"
            onChange={this.handleChange}
          />
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="department"
            value={department}
            placeholder="Department"
            onChange={this.handleChange}
          />
          <button type="submit">
            {selectedUser ? "Update User" : "Add User"}
          </button>
        </form>
      </div>
    );
  }
}

export default UserForm;
