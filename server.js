const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});
