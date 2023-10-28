const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require("dotenv");
const OpenAI = require("openai");

config.config()

const openai = new OpenAI({
  apiKey: process.env.API_KEY
})

sendToOpenAI = async (text) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: text}]
  });
    
  return response.choices[0].message;
}

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.post('/api/send-data', async (request, response) => {
  const dataFromFrontend = request.body.data;
  // console.log('Data received from frontend:', dataFromFrontend);
  const message = await sendToOpenAI(dataFromFrontend); //keep turned off until testing
  // console.log("message:", message);
  response.json({ message: message });
});

app.get('/', (request, response) => {
  response.send("Welcome, this part is working.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});