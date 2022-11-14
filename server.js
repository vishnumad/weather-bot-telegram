import express from 'express';
import { botURL, processUpdate } from './bot/bot.js';

const app = express();

app.use(express.json());

app.post(botURL, (request, response) => {
  processUpdate(request.body);
  response.sendStatus(200);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
