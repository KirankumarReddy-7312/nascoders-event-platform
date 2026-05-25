const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://KirankumarReddy:Kiran%40dbuser123@euphoriadb.0p8c2t2.mongodb.net/euphoria?retryWrites=true&w=majority&appName=EuphoriaDB')
  .then(async () => {
    console.log('Connected to DB');
    const db = mongoose.connection.db;
    const collections = await db.collections();
    for (let collection of collections) {
      if (collection.collectionName === 'bookings' || collection.collectionName === 'users') {
        if (collection.collectionName === 'users') {
           await collection.deleteMany({ role: { $ne: 'admin' } });
        } else {
           await collection.deleteMany({});
        }
        console.log('Cleared collection: ' + collection.collectionName);
      }
    }
    console.log('All required data removed.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
