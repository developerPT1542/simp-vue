const express = require('express');
const path = require('path');
const app = express();
 var request = require('request');

app.use('/api/*', function(req, res) {

  var url = 'http://localhost:3001'+req.baseUrl;
  var r = null;
  if(req.method === 'POST') {
     r = request.post({uri: url, json: req.body});
  } else {
     r = request(url);
  }

  req.pipe(r).pipe(res);
});




// Serve static files from the Vue app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


const port = process.env.PORT || 8083;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});