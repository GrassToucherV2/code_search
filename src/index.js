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

const username = 'GrassToucherV2';
const repo = 'my_crypto_library';
const filepath = 'lib/aes.c';

// const options = {
//   hostname: 'api.github.com',
//   port: 443,
//   path: `/repos/${username}/${repo}/contents/${filepath}`,
//   method: 'GET',
//   headers: {
//     // 'Authorization': `token ${token}`,
//     'User-Agent': 'Node.js GitHub Client' // GitHub requires a user-agent header
//   }
// };

// const req = https.request(options, (res) => {
//     let data = '';
//     console.log('Status Code:', res.statusCode);
  
//     res.on('data', (chunk) => {
//       data += chunk;
//     });
  
//     res.on('end', () => {
//       console.log('Data:', JSON.parse(data));
//       // decode the content from base64:
//       const content = Buffer.from(JSON.parse(data).content, 'base64').toString('utf8');
//       console.log('Decoded Content:', content);
//     });
//   });
  
//   req.on('error', (error) => {
//     console.error('Error:', error);
//   });
  
//   req.end();


// Function to get the repository tree (all files)
function getRepoTree(sha = 'main') {
  return new Promise((resolve, reject) => {
      const options = {
          hostname: 'api.github.com',
          port: 443,
          path: `/repos/${username}/${repo}/git/trees/${sha}?recursive=1`,
          method: 'GET',
          headers: {
              'Authorization': `token ${token}`,
              'User-Agent': 'Node.js GitHub Client'
          }
      };

      const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
              data += chunk;
          });
          res.on('end', () => {
              resolve(JSON.parse(data));
          });
      });

      req.on('error', (error) => {
          reject(error);
      });

      req.end();
  });
}

// Function to get the content of each file
function getFileContent(filepath) {
  return new Promise((resolve, reject) => {
      const options = {
          hostname: 'api.github.com',
          port: 443,
          path: `/repos/${username}/${repo}/contents/${filepath}`,
          method: 'GET',
          headers: {
              'Authorization': `token ${token}`,
              'User-Agent': 'Node.js GitHub Client'
          }
      };

      const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
              data += chunk;
          });
          res.on('end', () => {
              const content = JSON.parse(data).content;
              if (content) {
                  const decodedContent = Buffer.from(content, 'base64').toString('utf8');
                  resolve(decodedContent);
              } else {
                  resolve('');
              }
          });
      });

      req.on('error', (error) => {
          reject(error);
      });

      req.end();
  });
}

// Example usage
getRepoTree().then(tree => {
  if (tree.tree) {
      tree.tree.forEach(file => {
          if (file.type === 'blob') { // Filter to get only files, not directories
              getFileContent(file.path).then(content => {
                  console.log(file.path, content);
              }).catch(console.error);
          }
      });
  }
}).catch(console.error);