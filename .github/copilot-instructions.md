# Copilot Instructions for Mehmood Agricultural Platform

## Project Overview
This is a complete agricultural platform designed to help farmers, agricultural businesses, and stakeholders manage various aspects of agricultural operations including crop management, livestock tracking, weather monitoring, market analysis, and supply chain management.

## Technology Stack Guidelines
- Follow modern web development practices
- Use responsive design principles for web interfaces
- Implement secure authentication and authorization
- Follow RESTful API design patterns
- Use environment variables for configuration
- Implement proper error handling and logging

## Code Style and Standards
- Use clear, descriptive variable and function names
- Write self-documenting code with minimal but meaningful comments
- Follow consistent indentation (2 spaces for JavaScript/JSON, 4 spaces for Python)
- Use meaningful commit messages following conventional commits format
- Implement proper input validation and sanitization
- Follow security best practices for agricultural data handling

## Agricultural Domain Considerations
- **Data Privacy**: Agricultural data is sensitive - implement proper data protection
- **Seasonal Patterns**: Consider seasonal variations in agricultural operations
- **Location-Based Services**: Many features will be location-dependent (weather, soil data, etc.)
- **Offline Capabilities**: Rural areas may have limited internet connectivity
- **Multi-language Support**: Agricultural communities may be multilingual
- **Units of Measurement**: Support both metric and imperial systems
- **Regulatory Compliance**: Consider agricultural regulations and reporting requirements

## Development Practices
- Write unit tests for business logic
- Include integration tests for API endpoints
- Use database migrations for schema changes
- Implement proper logging for troubleshooting
- Use configuration management for different environments
- Document API endpoints with examples
- Implement graceful error handling with user-friendly messages

## Architecture Patterns
- Separate concerns (business logic, data access, presentation)
- Use dependency injection where appropriate
- Implement caching strategies for frequently accessed data
- Design for scalability to handle seasonal traffic spikes
- Use event-driven architecture for real-time notifications
- Implement background jobs for data processing and notifications

## Security Guidelines
- Sanitize all user inputs
- Use HTTPS for all communications
- Implement rate limiting on APIs
- Store sensitive data securely (encrypted at rest)
- Use secure session management
- Implement proper access controls based on user roles
- Regular security audits and dependency updates

## Performance Considerations
- Optimize database queries for large datasets
- Implement pagination for list endpoints
- Use appropriate caching strategies
- Compress images and optimize file uploads
- Consider CDN usage for static assets
- Monitor and optimize API response times

## User Experience
- Design intuitive interfaces for users with varying technical skills
- Provide clear feedback for user actions
- Implement progressive web app features for mobile users
- Support accessibility standards (WCAG guidelines)
- Design for slow internet connections
- Provide helpful error messages and guidance

## Data Management
- Use consistent data models across the platform
- Implement proper data validation
- Design for data analytics and reporting
- Consider data retention policies
- Plan for data backup and recovery
- Implement audit trails for critical operations

## Integration Guidelines
- Design APIs for third-party integrations (weather services, market data, etc.)
- Use standard formats for data exchange (JSON, CSV, etc.)
- Implement webhook support for real-time updates
- Consider IoT device integration for sensors and monitoring equipment
- Plan for mobile app synchronization

## Testing Strategy
- Unit tests for business logic and utilities
- Integration tests for API endpoints
- End-to-end tests for critical user workflows
- Performance tests for data-heavy operations
- Security testing for authentication and authorization
- User acceptance testing with agricultural domain experts

## Documentation
- Maintain up-to-date API documentation
- Document installation and setup procedures
- Create user guides for different user types
- Document configuration options and environment variables
- Maintain troubleshooting guides
- Document agricultural business rules and workflows