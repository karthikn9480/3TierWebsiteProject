import React, { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Handle form submission to store data
  const submitData = async (e) => {
    e.preventDefault(); // Prevent the default form submission action

    console.log("Submit button clicked"); // Debugging line

    // Validate form fields
    if (!name || !email) {
      setError('Name and email are required!');
      console.log("Name and email are required!"); // Debugging line
      return;
    }

    try {
      // Submit data to store
      const response = await fetch('https://1uxtnx24q7.execute-api.us-east-1.amazonaws.com/prod/storeData', {
        method: 'POST', // Corrected method name
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();
      console.log("Response:", result); // Debugging line

      if (response.ok) {
        setName('');
        setEmail('');
        setError(null); // Clear error
        fetchUsers(); // Fetch updated list after submission
      } else {
        setError(result.message || 'Something went wrong while storing data.');
      }
    } catch (err) {
      console.log("Error:", err); // Debugging line
      setError('Network error, please try again later.');
    }
  };

  // Fetch the list of users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch('https://1uxtnx24q7.execute-api.us-east-1.amazonaws.com/prod/getData');
      const result = await response.json();
      console.log("Users fetched:", result); // Debugging line

      if (response.ok) {
        setUsers(result); // Assuming the result is already an array of users
      } else {
        setError(result.message || 'Failed to retrieve data.');
      }
    } catch (err) {
      console.log("Fetch Users Error:", err); // Debugging line
      setError('Network error, please try again later.');
    }
  };

  // Fetch users when the component is mounted
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <h1>User Registration</h1>
      <form onSubmit={submitData}>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>List of Users</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user, index) => (
            <li key={index}>
              {/* Only display name and email */}
              <p><strong>{user.name}</strong></p>
              <p>{user.email}</p>
            </li>
          ))
        ) : (
          <p>No users available.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
