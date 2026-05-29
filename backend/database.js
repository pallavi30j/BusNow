const Datastore = require('nedb');
const bcrypt = require('bcryptjs');
const path = require('path');

const usersDB = new Datastore({ filename: path.join(__dirname, 'users.db'), autoload: true });
const busesDB = new Datastore({ filename: path.join(__dirname, 'buses.db'), autoload: true });

// Insert default buses if not exist
busesDB.count({}, (err, count) => {
  if (count === 0) {
    busesDB.insert([
      { busId: 'BUS-01', busName: 'Route 1 - Koramangala', stops: ['Koramangala', 'BTM', 'Jain University'] },
      { busId: 'BUS-02', busName: 'Route 2 - Whitefield', stops: ['Whitefield', 'Marathahalli', 'Jain University'] },
      { busId: 'BUS-03', busName: 'Route 3 - Hebbal', stops: ['Hebbal', 'Yeshwanthpur', 'Jain University'] },
    ]);
  }
});

// Insert default users if not exist
usersDB.count({}, (err, count) => {
  if (count === 0) {
    usersDB.insert([
      { name: 'Driver One', email: 'driver1@busnow.com', password: bcrypt.hashSync('driver123', 10), role: 'driver' },
      { name: 'Driver Two', email: 'driver2@busnow.com', password: bcrypt.hashSync('driver123', 10), role: 'driver' },
      { name: 'Student One', email: 'student1@busnow.com', password: bcrypt.hashSync('student123', 10), role: 'student' },
    ]);
  }
});

module.exports = { usersDB, busesDB };