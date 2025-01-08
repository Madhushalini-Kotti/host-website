import React, { useEffect, useState } from 'react'

function App() {

  const [users, setUsers] = useState([])

  const [newUser, setNewUser] = useState("");

  const [newAge, setNewAge] = useState("");

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  const getUsers = () => {
    fetch(SERVER_URL + '/users')
      .then((res) => res.json())
      .then ((json) => setUsers(json))
      .catch((error) => {
          console.log(error)
        })
  }

  useEffect(() => {
    getUsers()
  }, [])

  const handleClick = async () => {

    const user = { username: newUser, age: newAge };

    try {
      const response = await fetch(SERVER_URL + "/newUser", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      getUsers();

      setNewUser("")
      setNewAge("")

    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (event) => {
    const name = event.target.value;
    setNewUser(name);
  }

  const handleAgeChange = (event) => {
    const age = event.target.value;
    setNewAge(age);
  } 

  const deleteUser = async (event) => {
    const data = { id: event.target.value };

    try {

      const result = await fetch(SERVER_URL + "/deleteUser", {
        method: "POST",
        headers: {
          'Content-Type' : "application/json",
        },
        body: JSON.stringify(data)
      })

      const resultData = await result.json();
      console.log("User data deleted sucessfully", resultData);

    } catch (error) {
      console.error("couldn't delete the user");
    }

    getUsers();
  }

  return (
    <>
      
      <h1>My React website to learning hosting</h1>
      

      <input name="newuser" value={newUser} placeholder='ENTER USER NAME' onChange={handleInputChange} />
      <input name="age" value={newAge} placeholder='ENTER AGE' onChange={handleAgeChange} />
      <button onClick={handleClick}>Add user</button>

      <br />
      {users.map((user, index) => {
        return (<div key={index}><h1 key={index}>{user.username} {user.age}</h1> <button value={user.id} onClick={deleteUser}>Delete</button></div>)
      })}
    </>
  )
}

export default App