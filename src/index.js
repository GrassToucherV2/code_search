const express = require('express');
const https = require('https');
// require('dotenv').config();
const app = express();

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
  
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


const token = process.env.GIT_TOKEN;

const username = 'Nuohan-li';
const repo = 'my_crypto_library';
const filepath = 'lib/aes.c';

const options = {
  hostname: 'api.github.com',
  port: 443,
  path: `/repos/${username}/${repo}/contents/${filepath}`,
  method: 'GET',
  headers: {
    'Authorization': `token ${token}`,
    'User-Agent': 'Node.js GitHub Client' // GitHub requires a user-agent header
  }
};

const req = https.request(options, (res) => {
    let data = '';
    console.log('Status Code:', res.statusCode);
  
    res.on('data', (chunk) => {
      data += chunk;
    });
  
    res.on('end', () => {
      console.log('Data:', JSON.parse(data));
      // decode the content from base64:
      const content = Buffer.from(JSON.parse(data).content, 'base64').toString('utf8');
      console.log('Decoded Content:', content);
    });
  });
  
  req.on('error', (error) => {
    console.error('Error:', error);
  });
  
  req.end();