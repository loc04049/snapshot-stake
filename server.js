import express from 'express';
import { getDataStaked, getDataUnStake } from './index.js';
import { findBlockByTimestamp } from './function.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.get('/viction/staking', (req, res) => {
  getDataStaked('viction');
  res.send('export data viction');
});

app.get('/ether/staking', (req, res) => {
  getDataStaked('ether');
  res.send('export data ether');
});
app.get('/bsc/staking', (req, res) => {
  getDataStaked('bsc');
  res.send('export data bsc');
});

app.get('/ether/unstake', (req, res) => {
  getDataUnStake('ether');
  res.send('export data ether unstake');
});

app.get('/viction/unstake', (req, res) => {
  getDataUnStake('viction');
  res.send('export data ether unstake');
});

app.get('/bsc/unstake', (req, res) => {
  getDataUnStake('bsc');
  res.send('export data ether unstake');
});

app.get('/block', (req, res) => {
  findBlockByTimestamp(1734537900);
  res.send('block');
});
