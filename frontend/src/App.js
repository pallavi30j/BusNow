import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Login from './components/Login';
import BusSelection from './components/BusSelection';
import MapView from './components/MapView';

const socket = io('http://localhost:5000');

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/buses')
      .then(res => setBuses(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleLogin = (data) => {
    setUser(data.user);
    setToken(data.token);
  };

  if (!user) return <Login onLogin={handleLogin} />;
  if (!selectedBus) return <BusSelection buses={buses} onSelect={setSelectedBus} role={user.role} />;
  return <MapView socket={socket} role={user.role} selectedBus={selectedBus} token={token} />;
}

export default App;