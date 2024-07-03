// expressServer.js

const express = require('express');

function startExpressServer(port) {
  const app = express();

  // Define a route for the Express app
  app.get('/', (req, res) => {
    res.send('Hello from Express!');
  });

  // Start the Express app
  app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
  });
}

module.exports = { startExpressServer };
