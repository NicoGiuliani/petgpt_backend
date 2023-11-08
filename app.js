const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require("dotenv");
const OpenAI = require("openai");

config.config()

let conversation = [{"role": "system", "content": "Act as an educational assistant. If you are uncertain of the species the user provides, ask clarifying questions. After determining the species, ask the user if they have any questions regarding it, providing ideal care conditions for that animal in captivity."}, { role: "assistant", content: "Hello! What type of animal is your pet?"}];

const openai = new OpenAI({
  apiKey: process.env.API_KEY
})

sendToOpenAI = async () => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: conversation
  });

  conversation.push({ role: "assistant", content: response.choices[0].message.content}); 
  return response.choices[0].message;
}

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.post('/api/send-data', async (request, response) => {
  const dataFromFrontend = request.body.data;
  console.log("does any of it work...?");
  conversation.push({ role: "user", content: dataFromFrontend })
  const message = await sendToOpenAI();
  response.json({ message: message });
});

app.get('/', (request, response) => {
  response.send("Welcome, this part is working.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});