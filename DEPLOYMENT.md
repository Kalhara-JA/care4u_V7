# Deploying Care4U Backend to Render.com

This guide will help you deploy your Care4U backend application to Render.com.

## Prerequisites

1. A Render.com account (free tier available)
2. A PostgreSQL database (Render provides this)
3. Your application code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

Make sure your code is pushed to a Git repository. The following files are already configured:

- `render.yaml` - Render deployment configuration
- `package.json` - Updated with production scripts and Node.js version
- Database configuration updated for SSL in production

## Step 2: Create a PostgreSQL Database on Render

1. Go to [Render.com Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure your database:
   - **Name**: `care4u-database` (or your preferred name)
   - **Database**: `care4u_db`
   - **User**: `care4u_user` (or your preferred username)
   - **Plan**: Free (for development) or Starter (for production)
4. Click "Create Database"
5. Wait for the database to be created
6. Copy the **External Database URL** - you'll need this for environment variables

## Step 3: Deploy Your Web Service

1. In your Render dashboard, click "New +" → "Web Service"
2. Connect your Git repository
3. Configure your service:
   - **Name**: `care4u-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free (for development)

## Step 4: Set Environment Variables

In your Render web service dashboard, go to "Environment" tab and add these variables:

### Required Environment Variables:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://username:password@host:port/database_name?sslmode=require
JWT_SECRET=your_secure_jwt_secret_key_here_minimum_32_characters
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
FROM_EMAIL=your_gmail@gmail.com
FROM_NAME=Care4U App
```

### How to get these values:

1. **DATABASE_URL**: Copy from your PostgreSQL service dashboard
2. **JWT_SECRET**: Generate a secure random string (minimum 32 characters)
3. **GMAIL_USER**: Your Gmail address
4. **GMAIL_APP_PASSWORD**: Generate an App Password in your Google Account settings
5. **FROM_EMAIL**: Same as GMAIL_USER
6. **FROM_NAME**: Your app name

## Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build your application
   - Start the server
3. Wait for deployment to complete (usually 2-5 minutes)

## Step 6: Test Your Deployment

Once deployed, you can test your endpoints:

- **Health Check**: `https://your-app-name.onrender.com/health`
- **Database Health**: `https://your-app-name.onrender.com/health/db`

## Step 7: Configure Custom Domain (Optional)

1. Go to your service settings
2. Add your custom domain
3. Update DNS records as instructed by Render

## Environment-Specific Notes

### Free Tier Limitations:
- Services sleep after 15 minutes of inactivity
- Cold starts may take 30-60 seconds
- Limited to 750 hours per month

### Production Recommendations:
- Upgrade to a paid plan for better performance
- Set up monitoring and alerts
- Configure automatic deployments from your main branch

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check the build logs in Render dashboard
2. **Database Connection Issues**: Verify DATABASE_URL is correct
3. **Environment Variables**: Ensure all required variables are set
4. **SSL Issues**: The database config is already set up for Render's SSL

### Useful Commands:

```bash
# Test locally with production environment
NODE_ENV=production npm run build
NODE_ENV=production npm start

# Check logs in Render dashboard
# Go to your service → Logs tab
```

## API Endpoints

Your deployed API will be available at:
- Base URL: `https://your-app-name.onrender.com`
- Health: `GET /health`
- Database Health: `GET /health/db`
- Auth: `POST /api/auth/*`
- Meals: `GET/POST /api/meals/*`
- Sugar: `GET/POST /api/sugar/*`
- Exercise: `GET/POST /api/exercise/*`
- Appointments: `GET/POST /api/appointments/*`
- Meal Recommendations: `GET/POST /api/meal-recommendations/*`

## Security Notes

- Never commit `.env` files to your repository
- Use strong, unique JWT secrets
- Enable 2FA on your Gmail account
- Use App Passwords for Gmail SMTP
- Consider upgrading to paid plans for production use

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Your app logs: Available in Render dashboard
