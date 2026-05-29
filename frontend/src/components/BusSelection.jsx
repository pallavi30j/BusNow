import React from 'react';

function BusSelection({ buses, onSelect, role }) {
  return (
    <div style={{
      height: '100vh', background: '#1a1a2e',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <h1 style={{ color: 'white', marginBottom: '10px' }}>🚌 BusNow</h1>
      <p style={{ color: '#aaa', marginBottom: '30px' }}>
        {role === 'driver' ? 'Select your assigned bus' : 'Select your bus to track'}
      </p>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {buses.map((bus) => (
          <div key={bus.busId} onClick={() => onSelect(bus)}
            style={{
              background: '#16213e', border: '1px solid #e94560',
              borderRadius: '10px', padding: '16px 20px',
              marginBottom: '12px', cursor: 'pointer', color: 'white'
            }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{bus.busName}</div>
            <div style={{ color: '#aaa', fontSize: '13px', marginTop: '4px' }}>
              Stops: {bus.stops.join(' → ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusSelection;