import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapView({ socket, role, selectedBus, token }) {
  const [buses, setBuses] = useState([]);
  const [sharing, setSharing] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    socket.on('buses:update', (data) => {
      setBuses(data);
    });

    socket.on('bus:nearStop', (data) => {
      if (data.busId === selectedBus.busId) {
        setNotification(`🚌 ${data.busName} is ${data.distance}m away from ${data.stopName}!`);
        setTimeout(() => setNotification(null), 5000);
      }
    });

    return () => {
      socket.off('buses:update');
      socket.off('bus:nearStop');
    };
  }, [socket, selectedBus]);

  const startSharing = () => {
    setSharing(true);
    socket.emit('driver:join', selectedBus.busId);
    navigator.geolocation.watchPosition((position) => {
      socket.emit('driver:location', {
        busId: selectedBus.busId,
        busName: selectedBus.busName,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        token: token,
      });
    }, (err) => console.error(err),
    { enableHighAccuracy: true, maximumAge: 3000 });
  };

  const myBus = buses.find(b => b.busId === selectedBus.busId);

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Notification banner */}
      {notification && (
        <div style={{
          position: 'fixed', top: '70px', left: '50%',
          transform: 'translateX(-50%)',
          background: '#4ecca3', color: '#1a1a2e',
          padding: '12px 24px', borderRadius: '8px',
          fontWeight: 'bold', fontSize: '14px',
          zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          {notification}
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: '12px 20px', background: '#1a1a2e',
        color: 'white', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>🚌 {selectedBus.busName}</span>
          <span style={{
            marginLeft: '10px', fontSize: '12px', padding: '2px 8px',
            borderRadius: '99px',
            background: myBus ? '#4ecca3' : '#e94560',
            color: '#1a1a2e', fontWeight: 'bold'
          }}>
            {myBus ? '● LIVE' : '○ Waiting for bus...'}
          </span>
        </div>
        {role === 'driver' && !sharing && (
          <button onClick={startSharing} style={{
            padding: '8px 16px', background: '#e94560',
            color: 'white', border: 'none',
            borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            Start Trip
          </button>
        )}
        {role === 'driver' && sharing && (
          <span style={{ color: '#4ecca3', fontSize: '13px' }}>📍 Sharing location...</span>
        )}
      </div>

      {/* Map */}
      <MapContainer center={[12.9716, 77.5946]} zoom={13}
        style={{ flex: 1, width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {myBus && (
          <Marker position={[myBus.lat, myBus.lng]}>
            <Popup>
              <strong>{myBus.busName}</strong><br />
              Driver: {myBus.driverName}<br />
              Last updated: {new Date(myBus.updatedAt).toLocaleTimeString()}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Stops bar */}
      <div style={{
        padding: '10px 20px', background: '#16213e',
        color: '#aaa', fontSize: '12px'
      }}>
        Stops: {selectedBus.stops.join(' → ')}
      </div>
    </div>
  );
}

export default MapView;