
const http = require('http');

const data = JSON.stringify({
    name: 'Test User API',
    email: 'api_test_verified@example.com',
    password: 'password123',
    phone: '5559998877'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/customer/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseBody = '';

    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:', responseBody);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
