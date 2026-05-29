import React from 'react';

function RoleSelection({ onSelect }) {
  return (
    <div style={{
      height: '100vh', background: '#1a1a2e',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '10px' }}>🚌 BusNow</h1>
      <p style={{ color: '#aaa', marginBottom: '40px', fontSize: '16px' }}>
        Live College Bus Tracker
      </p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div onClick={() => onSelect('student')}
          style={{
            background: '#16213e', border: '2px solid #4ecca3',
            borderRadius: '12px', padding: '30px 40px',
            cursor: 'pointer', textAlign: 'center', color: 'white'
          }}>
          <div style={{ fontSize: '40px' }}>🎓</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>I am a Student</div>
          <div style={{ color: '#aaa', fontSize: '13px', marginTop: '6px' }}>Track my bus</div>
        </div>
        <div onClick={() => onSelect('driver')}
          style={{
            background: '#16213e', border: '2px solid #e94560',
            borderRadius: '12px', padding: '30px 40px',
            cursor: 'pointer', textAlign: 'center', color: 'white'
          }}>
          <div style={{ fontSize: '40px' }}>🚌</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>I am a Driver</div>
          <div style={{ color: '#aaa', fontSize: '13px', marginTop: '6px' }}>Share my location</div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;