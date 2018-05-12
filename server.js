const express = require('express');
const parser = require('body-parser');
const bot = require('./bot');

const app = express();

app.use(parser.json());

app.post(bot.URL, (request, response) => {
  bot.processUpdate(request.body);
  response.sendStatus(200);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
