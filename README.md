# 🌱 Mehmood Agricultural Platform - Complete Production Ready

A comprehensive, full-stack agricultural management platform built with modern technologies. This platform provides farmers and agricultural professionals with tools to manage farms, monitor crops, track weather, analyze performance, and maintain inventory.

## 🚀 Features

### 🏠 Core Features
- **User Authentication & Authorization** - Secure login/register with JWT tokens
- **Multi-Role Support** - Farmer, Agronomist, and Admin roles
- **Farm Management** - Create and manage multiple farm locations
- **Crop Monitoring** - Track crop lifecycle from planting to harvest
- **Weather Integration** - Real-time weather data and forecasts
- **Analytics Dashboard** - Comprehensive insights and reporting
- **Inventory Management** - Track supplies, equipment, and usage
- **Responsive Design** - Works seamlessly on desktop and mobile

### 🛠 Technical Features
- **Production Ready** - Docker containerization with multi-stage builds
- **Database Optimization** - MongoDB with proper indexing and aggregation
- **Caching Layer** - Redis for improved performance
- **API Security** - Rate limiting, CORS, helmet protection
- **File Upload** - Cloudinary integration for image management
- **Real-time Updates** - Modern React with React Query
- **Error Handling** - Comprehensive error handling and logging

## 🏗 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Primary database
- **Mongoose** - ODM for MongoDB
- **Redis** - Caching layer
- **JWT** - Authentication
- **Multer & Cloudinary** - File uploads

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hook Form** - Form handling

### DevOps & Production
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy
- **ESLint & Prettier** - Code quality
- **Jest** - Testing framework

## 🚦 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB 4.4+
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/moazmahmood/mehmood-agricultural-platform-complete.git
cd mehmood-agricultural-platform-complete
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development servers**
```bash
npm run dev
```

This will start:
- Backend server at http://localhost:5000
- Frontend React app at http://localhost:3000

### 🐳 Docker Deployment

For production deployment with Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
mehmood-agricultural-platform-complete/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   └── utils/             # Utility functions
│   └── package.json
├── server/                     # Node.js backend
│   ├── controllers/           # Route handlers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── config/               # Configuration files
│   └── package.json
├── docker-compose.yml         # Docker services
├── Dockerfile                # Docker build instructions
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Farms
- `GET /api/farms` - List user farms
- `POST /api/farms` - Create new farm
- `GET /api/farms/:id` - Get farm details
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm

### Crops
- `GET /api/crops` - List crops
- `POST /api/crops` - Create new crop
- `GET /api/crops/:id` - Get crop details
- `PUT /api/crops/:id` - Update crop
- `POST /api/crops/:id/monitoring` - Add monitoring entry

### Weather
- `GET /api/weather/current` - Current weather
- `GET /api/weather/forecast` - Weather forecast
- `GET /api/weather/alerts` - Weather alerts

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/crops` - Crop analytics
- `GET /api/analytics/financial` - Financial analytics

## 🔐 Environment Variables

Key environment variables you need to set:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/agricultural_platform

# JWT Security
JWT_SECRET=your_super_secret_key

# Weather API (OpenWeatherMap)
WEATHER_API_KEY=your_api_key

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
```

## 🧪 Testing

```bash
# Run backend tests
cd server && npm test

# Run frontend tests
cd client && npm test

# Run all tests
npm test
```

## 📈 Performance Features

- **Database Indexing** - Optimized queries with proper indexes
- **API Caching** - Redis caching for frequent requests
- **Image Optimization** - Cloudinary for image processing
- **Code Splitting** - React lazy loading for better performance
- **Compression** - Gzip compression for production

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Cross-origin request security
- **Helmet.js** - Security headers
- **Input Validation** - Express validator for API inputs

## 🚀 Production Deployment

### Docker Production Setup

1. **Configure environment**
```bash
cp .env.example .env
# Update production values
```

2. **Build and deploy**
```bash
docker-compose -f docker-compose.yml up -d
```

3. **Monitor services**
```bash
docker-compose logs -f
```

### Traditional Deployment

1. **Build frontend**
```bash
cd client && npm run build
```

2. **Start production server**
```bash
npm run server:start
```

## 📊 Monitoring & Logging

- Health check endpoint: `/api/health`
- Application logs in `logs/` directory
- Docker container health checks
- Performance monitoring ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Moaz Mahmood**
- GitHub: [@moazmahmood](https://github.com/moazmahmood)

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- MongoDB for database solutions
- React team for the amazing framework
- All contributors and users

---

**Built with ❤️ for the agricultural community**