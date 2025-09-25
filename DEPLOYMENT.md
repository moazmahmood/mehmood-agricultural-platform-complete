# Deployment Guide

This guide covers different deployment options for the Agricultural Platform.

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- At least 2GB RAM available
- OpenWeatherMap API key (optional)

### Quick Start with Docker

1. **Clone and Setup**
```bash
git clone https://github.com/moazmahmood/mehmood-agricultural-platform-complete.git
cd mehmood-agricultural-platform-complete
```

2. **Configure Environment**
```bash
# Copy and edit environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit server/.env with your configuration
# Edit client/.env with your API URL
```

3. **Deploy with Docker Compose**
```bash
docker-compose up -d
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Production Docker Deployment

For production, update the following in `docker-compose.yml`:

```yaml
# Generate strong JWT secret
JWT_SECRET: your-strong-production-jwt-secret

# Use your production domain
CLIENT_URL: https://your-domain.com

# Add your weather API key
WEATHER_API_KEY: your-openweathermap-api-key
```

## ☁️ Cloud Deployment Options

### Option 1: Heroku

**Backend Deployment:**
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-agricultural-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set WEATHER_API_KEY=your-api-key

# Deploy
git subtree push --prefix server heroku main
```

**Frontend Deployment:**
```bash
# Build and deploy to Netlify or Vercel
npm run build

# For Netlify: drag and drop the dist folder
# For Vercel: connect your GitHub repo
```

### Option 2: DigitalOcean

**Using DigitalOcean App Platform:**

1. **Create App**
   - Connect your GitHub repository
   - Configure build and run commands

2. **Backend Configuration**
   - Build Command: `cd server && npm install`
   - Run Command: `cd server && npm start`
   - Environment Variables: Add all required variables

3. **Frontend Configuration**
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`

### Option 3: AWS

**Using Elastic Beanstalk:**

1. **Backend (API)**
```bash
# Install EB CLI
pip install awsebcli

# Initialize and deploy
cd server
eb init
eb create production-api
eb deploy
```

2. **Frontend (S3 + CloudFront)**
```bash
# Build the app
cd client
npm run build

# Upload to S3 and configure CloudFront
aws s3 sync dist/ s3://your-bucket-name
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Cluster**
   - Go to MongoDB Atlas
   - Create a new cluster
   - Configure network access

2. **Get Connection String**
```
mongodb+srv://<username>:<password>@cluster.mongodb.net/agricultural_platform?retryWrites=true&w=majority
```

3. **Update Environment Variables**
```bash
MONGODB_URI=your-atlas-connection-string
```

### Self-Hosted MongoDB

If using your own MongoDB instance:

```bash
# Install MongoDB
# Ubuntu/Debian:
sudo apt install mongodb

# Configure MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database and user
mongo
> use agricultural_platform
> db.createUser({
    user: "appuser",
    pwd: "securepassword",
    roles: ["readWrite"]
  })
```

## 🔐 Environment Variables

### Required Variables

**Server (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secure-jwt-secret
CLIENT_URL=https://your-frontend-domain.com
```

**Optional Variables:**
```env
WEATHER_API_KEY=your-openweathermap-api-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Client (.env):**
```env
VITE_API_URL=https://your-api-domain.com/api
```

## 🚀 Performance Optimization

### Backend Optimizations

1. **Enable Production Mode**
```bash
NODE_ENV=production
```

2. **Use PM2 for Process Management**
```bash
npm install -g pm2
pm2 start server/index.js --name "agricultural-api"
pm2 startup
pm2 save
```

3. **Enable Compression**
Already implemented in the server with compression middleware.

### Frontend Optimizations

1. **Build Optimization**
The Vite build process automatically optimizes the frontend.

2. **CDN Integration**
Use CloudFront or similar CDN for serving static assets.

3. **Caching Strategy**
Nginx configuration includes proper caching headers.

## 🔒 Security Checklist

### Production Security

- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Regular security updates

### SSL Certificate Setup

**Using Let's Encrypt with Nginx:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📊 Monitoring and Logging

### Application Monitoring

1. **PM2 Monitoring**
```bash
pm2 monit
pm2 logs
```

2. **Health Checks**
The application includes health check endpoints:
- Backend: `/api/health`

3. **Database Monitoring**
Monitor MongoDB performance and usage through Atlas dashboard or self-hosted monitoring tools.

## 🔄 Backup and Recovery

### Database Backup

**MongoDB Atlas:**
- Automatic backups are included
- Point-in-time recovery available

**Self-hosted MongoDB:**
```bash
# Create backup
mongodump --db agricultural_platform --out backup/

# Restore backup
mongorestore --db agricultural_platform backup/agricultural_platform/
```

### Application Backup

- Keep your environment files secure and backed up
- Version control your code changes
- Document any custom configurations

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**
   - Use Nginx or cloud load balancers
   - Distribute traffic across multiple API instances

2. **Database Scaling**
   - MongoDB Atlas auto-scaling
   - Read replicas for read-heavy workloads

3. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data

### Vertical Scaling

- Monitor resource usage
- Upgrade server specifications as needed
- Optimize database queries and indexes

## 🆘 Troubleshooting

### Common Issues

**Connection Issues:**
- Check environment variables
- Verify network connectivity
- Confirm firewall settings

**Build Failures:**
- Check Node.js versions
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Database Issues:**
- Verify MongoDB connection string
- Check database permissions
- Monitor connection limits

For more help, check the application logs and error messages.