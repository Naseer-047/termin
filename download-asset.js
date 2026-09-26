const https = require('https');
const fs = require('fs');
const path = require('path');

const assetDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetDir)) {
  fs.mkdirSync(assetDir, { recursive: true });
}

const file = fs.createWriteStream(path.join(assetDir, 'default-photo.jpg'));
https.get('https://picsum.photos/400/300', function(response) {
  if (response.statusCode === 301 || response.statusCode === 302) {
    https.get(response.headers.location, function(res2) {
      res2.pipe(file);
      file.on('finish', () => file.close());
    });
  } else {
    response.pipe(file);
    file.on('finish', () => file.close());
  }
});
