# 🚀 NDA Survey Backend

A lightweight Express.js backend service for the NDA Survey application with MongoDB integration.

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **MongoDB Atlas account** (or local MongoDB instance)

### 1. Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend root directory:

```bash
# Copy the example file
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
PORT=5001
NODE_ENV=development

# MongoDB Configuration - Replace with your connection string
MONGODB_URI=mongodb+srv://intecsystemdev:YOUR_PASSWORD@cluster0.oriwr.mongodb.net/nda-survey-db?retryWrites=true&w=majority&appName=Cluster0

# Security
JWT_SECRET=your_jwt_secret_here_change_in_production

# CORS
FRONTEND_URL=http://localhost:5176
```

### 3. Database Setup

Your MongoDB database will be automatically created when you first run the application. The connection string provided will create a database called `nda-survey-db`.

**Note:** Replace `YOUR_PASSWORD` in the MongoDB URI with your actual database password.

### 4. Running the Application

#### Development Mode (with auto-reload)

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5001`

## 📋 API Endpoints

### Health Check

- **GET** `/api/health` - Check server status

### Survey Management

- **POST** `/api/surveys` - Submit a new survey
- **GET** `/api/surveys` - Get all surveys (with filtering and pagination)
- **GET** `/api/surveys/:id` - Get single survey by ID
- **PATCH** `/api/surveys/:id/status` - Update survey status

### Statistics

- **GET** `/api/surveys/stats/overview` - Get survey statistics

## 🔧 API Usage Examples

### Submit Survey

```bash
POST /api/surveys
Content-Type: application/json

{
  "ndaDetails": {
    "bankName": "Example Bank",
    "bankAddress": "123 Main St",
    "bankRegNumber": "123456789",
    "bankContactName": "John Doe",
    "bankContactPosition": "Manager",
    "receiverName": "Receiver Corp",
    "receiverAddress": "456 Business Ave",
    "receiverRegNumber": "987654321",
    "receiverContactName": "Jane Smith",
    "receiverContactPosition": "Director",
    "ndaPurpose": "Business evaluation",
    "ndaDurationYears": "2",
    "ndaEffectiveDate": "2024-01-01"
  },
  "questionnaireData": {
    "fillDate": "2024-01-15",
    "contactPersonName": "John Doe",
    "contactPersonPosition": "IT Manager",
    "contactPersonEmail": "john@example.com",
    "q1_1": "Да",
    "q1_2": "Не",
    "additionalComments": "Some comments here"
  }
}
```

### Get Surveys with Filtering

```bash
GET /api/surveys?page=1&limit=10&search=bank&status=submitted&sortBy=submissionDate&sortOrder=desc
```

## 🛡️ Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing protection
- **Rate Limiting** - Prevents abuse (100 requests per 15 minutes)
- **Input Validation** - Request validation
- **Compression** - Gzip compression for responses

## 📊 Database Schema

### Survey Collection

```javascript
{
  _id: ObjectId,
  ndaDetails: {
    bankName: String (required),
    bankAddress: String (required),
    bankRegNumber: String (required),
    bankContactName: String (required),
    bankContactPosition: String (required),
    receiverName: String (required),
    receiverAddress: String (required),
    receiverRegNumber: String (required),
    receiverContactName: String (required),
    receiverContactPosition: String (required),
    ndaPurpose: String (required),
    ndaDurationYears: String (required),
    ndaEffectiveDate: String (required)
  },
  questionnaireData: {
    fillDate: String,
    contactPersonName: String,
    contactPersonPosition: String,
    contactPersonEmail: String,
    q1_1: String,
    q1_1_details: String,
    q1_2: String,
    q1_2_details: String,
    additionalComments: String
  },
  submissionDate: Date (default: Date.now),
  ipAddress: String,
  userAgent: String,
  status: String (enum: ['draft', 'submitted', 'reviewed'], default: 'submitted'),
  reviewNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://your-production-connection-string
JWT_SECRET=your-secure-production-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 Deployment (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start server.js --name "nda-survey-api"

# Save PM2 configuration
pm2 save

# Enable PM2 startup on boot
pm2 startup
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Verify your connection string
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure the password is correctly URL-encoded

2. **Port Already in Use**

   - Change the PORT in your `.env` file
   - Or kill the process using the port: `lsof -ti:5001 | xargs kill -9`

3. **CORS Errors**
   - Verify the FRONTEND_URL in your `.env` file
   - Make sure the frontend is running on the specified URL

### Logs

The application uses Morgan for HTTP request logging and console.log for application logs.

## 📈 Monitoring

### Health Check

Visit `http://localhost:5001/api/health` to check if the server is running properly.

Response:

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
