// MongoDB initialization script
db = db.getSiblingDB('agricultural_platform');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { bsonType: 'string' },
        email: { bsonType: 'string' },
        password: { bsonType: 'string' },
        role: { enum: ['farmer', 'admin', 'agronomist'] }
      }
    }
  }
});

db.createCollection('farms');
db.createCollection('crops');
db.createCollection('weather');
db.createCollection('inventory');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

db.farms.createIndex({ owner: 1 });
db.farms.createIndex({ 'location.coordinates': '2dsphere' });

db.crops.createIndex({ farmer: 1 });
db.crops.createIndex({ farm: 1 });
db.crops.createIndex({ status: 1 });
db.crops.createIndex({ plantingDate: 1 });

db.weather.createIndex({ 'location.coordinates': '2dsphere' });
db.weather.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

db.inventory.createIndex({ owner: 1 });
db.inventory.createIndex({ category: 1 });
db.inventory.createIndex({ status: 1 });
db.inventory.createIndex({ name: 'text', description: 'text' });

print('MongoDB initialized with collections and indexes!');