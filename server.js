import express, { json } from 'express';
import get from 'axios';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(json());

app.post('/fetch-data', async (req, res) => {
  try {
    const valueFromBrowser = req.body.value;
    
    // Use the value obtained from the browser in your request
    const response = await get(`https://bolls.life/dictionary-definition/BDBT/${valueFromBrowser}`);
    
    // Return the response data to the browser
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
