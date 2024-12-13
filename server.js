import express from 'express';
import { getDataStaked } from './index.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.get('/viction', (req, res) => {
  getDataStaked('viction')
  res.send('export data viction');
});

app.get('/ether', (req, res) => {
  getDataStaked('ether')
  res.send('export data ether');
});
app.get('/bsc', (req, res) => {
  getDataStaked('bsc')
  res.send('export data bsc');
});
