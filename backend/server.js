const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./database');
const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/buses');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);

const JWT_SECRET = 'busnow_secret_key';
const activeBuses = {};

const stops = {
  'BUS-01': [
    { name: 'Koramangala', lat: 12.9352, lng: 77.6245 },
    { name: 'BTM', lat: 12.9166, lng: 77.6101 },
    { name: 'Jain University', lat: 12.9716, lng: 77.5946 }
  ],
  'BUS-02': [
    { name: 'Whitefield', lat: 12.9698, lng: 77.7499 },
    { name: 'Marathahalli', lat: 12.9591, lng: 77.6972 },
    { name: 'Jain University', lat: 12.9716, lng: 77.5946 }
  ],
  'BUS-03': [
    { name: 'Hebbal', lat: 13.0358, lng: 77.5970 },
    { name: 'Yeshwanthpur', lat: 13.0275, lng: 77.5505 },
    { name: 'Jain University', lat: 12.9716, lng: 77.5946 }
  ]
};

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function checkNearbyStops(bus, io) {
  const busStops = stops[bus.busId];
  if (!busStops) return;
  busStops.forEach(stop => {
    const distance = getDistance(bus.lat, bus.lng, stop.lat, stop.lng);
    if (distance < 50000) {
      io.emit('bus:nearStop', {
        busId: bus.busId,
        busName: bus.busName,
        stopName: stop.name,
        distance: Math.round(distance)
      });
    }
  });
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('driver:location', (data) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET);
      if (decoded.role !== 'driver') return;

      activeBuses[data.busId] = {
        busId: data.busId,
        busName: data.busName,
        lat: data.lat,
        lng: data.lng,
        driverName: decoded.name,
        updatedAt: new Date()
      };

      io.emit('buses:update', Object.values(activeBuses));
      checkNearbyStops(activeBuses[data.busId], io);

    } catch (err) {
      console.log('Invalid token');
    }
  });

  socket.on('student:watch', (busId) => {
    socket.join(busId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`BusNow server running on port ${PORT}`);
});