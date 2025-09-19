#!/usr/bin/env node

/**
 * Health check script for Render deployment
 * This script can be used to verify that the deployment is working correctly
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runHealthCheck() {
  console.log(`🔍 Running health check for: ${BASE_URL}`);
  console.log('='.repeat(50));
  
  try {
    // Test basic health endpoint
    console.log('1. Testing basic health endpoint...');
    const healthResponse = await makeRequest(`${BASE_URL}/health`);
    
    if (healthResponse.status === 200 && healthResponse.data.success) {
      console.log('✅ Basic health check passed');
      console.log(`   Message: ${healthResponse.data.message}`);
      console.log(`   Timestamp: ${healthResponse.data.timestamp}`);
    } else {
      console.log('❌ Basic health check failed');
      console.log(`   Status: ${healthResponse.status}`);
      console.log(`   Response:`, healthResponse.data);
    }
    
    // Test database health endpoint
    console.log('\n2. Testing database health endpoint...');
    const dbHealthResponse = await makeRequest(`${BASE_URL}/health/db`);
    
    if (dbHealthResponse.status === 200 && dbHealthResponse.data.success) {
      console.log('✅ Database health check passed');
      console.log(`   Message: ${dbHealthResponse.data.message}`);
      console.log(`   Timestamp: ${dbHealthResponse.data.timestamp}`);
    } else {
      console.log('❌ Database health check failed');
      console.log(`   Status: ${dbHealthResponse.status}`);
      console.log(`   Response:`, dbHealthResponse.data);
    }
    
    // Test 404 endpoint
    console.log('\n3. Testing 404 handling...');
    const notFoundResponse = await makeRequest(`${BASE_URL}/nonexistent`);
    
    if (notFoundResponse.status === 404) {
      console.log('✅ 404 handling works correctly');
    } else {
      console.log('❌ 404 handling failed');
      console.log(`   Status: ${notFoundResponse.status}`);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Health check completed!');
    
  } catch (error) {
    console.error('❌ Health check failed with error:', error.message);
    process.exit(1);
  }
}

// Run the health check
runHealthCheck();
