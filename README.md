# 🚀 Complete Agricultural Platform - Production Ready

A comprehensive, modern agricultural management platform designed for farmers, advisors, and agricultural businesses. This full-stack application provides complete farm management, crop tracking, weather integration, and agricultural analytics.

## 🌟 Features

### 🏗️ Core Platform
- **User Management**: Multi-role authentication system (Farmer, Advisor, Admin)
- **Farm Management**: Comprehensive farm profiles with geolocation and field management
- **Crop Tracking**: Complete crop lifecycle management from planting to harvest
- **Weather Integration**: Real-time weather data with agricultural recommendations
- **Analytics Dashboard**: Financial tracking, yield analysis, and performance metrics

### 🔐 Security & Authentication
- JWT-based authentication with secure token management
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Rate limiting and security headers
- Input validation and sanitization

### 🌤️ Weather & Environmental
- OpenWeatherMap API integration
- Location-based weather alerts
- Agricultural advice based on weather conditions
- Forecast data for planning
- Historical weather analysis

### 📊 Agricultural Features
- **Crop Management**: Planting schedules, growth tracking, treatment records
- **Field Operations**: Irrigation tracking, fertilizer application, pest control
- **Financial Tracking**: Investment analysis, profit calculations, expense tracking
- **Monitoring System**: Regular crop health assessments and photo documentation
- **Yield Prediction**: Data-driven harvest forecasting

## 🏗️ Architecture

### Backend (Node.js/Express)
```
server/
├── controllers/     # Request handlers and business logic
├── models/         # MongoDB data models (User, Farm, Crop)
├── routes/         # API route definitions
├── middleware/     # Authentication, validation, error handling
├── services/       # External API integrations (Weather)
├── config/         # Database and environment configuration
└── utils/          # Helper functions and utilities
```

### Frontend (React/Vite)
```
client/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Main application pages
│   ├── services/    # API client services
│   ├── contexts/    # React context providers
│   ├── hooks/       # Custom React hooks
│   └── utils/       # Helper functions
├── public/          # Static assets
└── dist/           # Production build output
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- OpenWeatherMap API key (optional, for weather features)

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

3. **Environment Setup**

**Server environment** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/agricultural_platform
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
WEATHER_API_KEY=your-openweathermap-api-key
```

**Client environment** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start Development Servers**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run server:dev  # Backend only
npm run client:dev  # Frontend only
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                # Start both frontend and backend
npm run server:dev        # Start backend only
npm run client:dev        # Start frontend only

# Production
npm run build             # Build frontend for production
npm run server:start      # Start production server

# Testing & Quality
npm test                  # Run all tests
npm run lint             # Run linters
npm run lint:fix         # Fix lint issues
```

### API Documentation

#### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update profile
PUT  /api/auth/change-password # Change password
```

#### Farm Management
```
GET    /api/farms          # List farms
POST   /api/farms          # Create farm
GET    /api/farms/:id      # Get farm details
PUT    /api/farms/:id      # Update farm
DELETE /api/farms/:id      # Delete farm
POST   /api/farms/:id/fields # Add field to farm
```

#### Crop Management
```
GET    /api/crops          # List crops
POST   /api/crops          # Create crop
GET    /api/crops/:id      # Get crop details
PUT    /api/crops/:id      # Update crop
DELETE /api/crops/:id      # Delete crop
GET    /api/crops/analytics # Get crop analytics
POST   /api/crops/:id/monitoring # Add monitoring data
POST   /api/crops/:id/treatments # Add treatment record
```

#### Weather Integration
```
GET /api/weather/current      # Current weather by coordinates
GET /api/weather/forecast     # Weather forecast
GET /api/weather/farm/:id     # Weather for specific farm
GET /api/weather/alerts       # Weather alerts for user's farms
```

## 📱 User Interface

### Dashboard Features
- **Welcome Overview**: Personalized greeting and quick stats
- **Statistics Cards**: Farm count, active crops, investment tracking, weather alerts
- **Recent Activities**: Latest farms and crops with quick access
- **Weather Alerts**: Critical weather notifications with agricultural advice
- **Quick Actions**: Fast access to common tasks

### Responsive Design
- Mobile-first approach with responsive grid system
- Touch-friendly interface for field use
- Optimized for tablets and mobile devices
- Progressive Web App (PWA) capabilities

## 🔧 Configuration

### Database Schema

**User Model**:
- Authentication credentials and profile information
- Role-based permissions (farmer, advisor, admin)
- Contact information and preferences

**Farm Model**:
- Location data with coordinates for weather integration
- Soil information and irrigation systems
- Field management with crop assignments
- Organic certification tracking

**Crop Model**:
- Complete lifecycle tracking from planting to harvest
- Treatment records (fertilizers, pesticides, irrigation)
- Financial tracking with investment and revenue data
- Monitoring data with growth stages and health assessments

### Security Features
- **Authentication**: JWT tokens with secure expiration
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevent API abuse
- **Data Validation**: Input sanitization and validation
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers for production

## 🌐 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm run server:start
```

### Environment Variables
Ensure all environment variables are properly configured for production:
- Database connection strings
- JWT secrets (use strong, unique keys)
- API keys for external services
- CORS settings for your domain

### Recommended Deployment Platforms
- **Backend**: Heroku, DigitalOcean, AWS EC2
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Database**: MongoDB Atlas, DigitalOcean Managed Databases

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Moaz Mahmood**
- GitHub: [@moazmahmood](https://github.com/moazmahmood)

## 🙏 Acknowledgments

- OpenWeatherMap for weather data API
- MongoDB for database solutions
- React team for the excellent frontend framework
- Express.js for the robust backend framework
- All contributors and the open-source community

---

**Built with ❤️ for the agricultural community**