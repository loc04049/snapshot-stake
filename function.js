import flattenDeep from 'lodash/flattenDeep.js';
import os from 'os';
import path from 'path';
import XLSX from 'xlsx';
import bigdecimal from 'bigdecimal';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import moment from 'moment';

export const dataChain = {
  viction: {
    // rpc: 'https://rpc.tomochain.com',
    rpc: 'https://rpc5.viction.xyz',
    fromBlock: 72525940,
    fromBlockUnStake: 88205602, //11:05 PM 18/12/2024 GMT+7
    toBlock: 'latest',
    addressContract: '0xb1B7c19c9C919346390a1E40aaBCED8A66b53C06',
    chain: 'viction',
  },
  bsc: {
    rpc: 'https://bscrpc.com',
    fromBlock: 13457759,
    fromBlockUnStake: 44985630,
    toBlock: 'latest',
    addressContract: '0x08ac9c38ce078b9b81e5ab5bf8aafc3d2db94385',
    chain: 'bsc',
  },
  ether: {
    rpc: 'https://ethereum.publicnode.com',
    fromBlock: 13803141,
    fromBlockUnStake: 21430492,
    toBlock: 'latest',
    addressContract: '0x836bf46520C373Fdc4dc7E5A3bAe735d13bD44e3',
    chain: 'ether',
  },
};

export const getPastLogs = async (data, web3) => {
  console.log('🚀 ~ await getPastLogs');
  if (data.chain !== 'ether') {
    const logs = await web3.eth.getPastLogs({
      fromBlock: data.fromBlock,
      toBlock: data.toBlock,
      address: data.addressContract, // Contract NFT
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      ], // topic send nft
    });

    return logs;
  }
  // ether

  let fullResponse = [];

  const latestBlockNumber =
    data.toBlock !== 'latest'
      ? data.toBlock
      : await web3.eth
          .getBlock('latest')
          .then((item) => item.number)
          .catch(0);

  for (let i = data.fromBlock; i < latestBlockNumber; i += 50000) {
    const toBlock =
      i + 50000 >= latestBlockNumber ? latestBlockNumber : i + 50000;

    const dataLog = await web3.eth.getPastLogs({
      fromBlock: i,
      toBlock: toBlock,
      address: data.addressContract, // Contract NFT
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      ], // topic send nft
    });

    Array.prototype.push.apply(fullResponse, dataLog);
  }

  return fullResponse;
};

export const getInfoNftStake = async ({ contract, arrNFT }) => {
  console.log('🚀 ~ await get info getInfoNftStake');

  // uniq address
  const addressList = [...new Set(Object.values(arrNFT))];
  console.log('🚀 ~ addressList:', addressList.length);

  const arrInfo = [];

  for (const addressHolder of addressList) {
    // const arrInfo = await Promise.all(addressList.map(async addressHolder => {

    const dataLog = await contract.methods.walletOfOwner(addressHolder).call();
    console.log('🚀 ~ arrInfo ~ addressHolder:', addressHolder);

    const dataStaked = dataLog
      .filter((itemLog) => itemLog.flag && !itemLog.pending_flag)
      .map((itemMap) => {
        const newEstStaked = new BigNumber(itemMap.est_staked);
        const newAmountStake = new BigNumber(itemMap.amount);
        return {
          id: itemMap.id,
          est_staked: convertWeiToBalance(newEstStaked.toFixed()),
          amount: convertWeiToBalance(newAmountStake.toFixed()),
          address: addressHolder,
          totalAmount: convertWeiToBalance(
            newAmountStake.plus(newEstStaked).toFixed()
          ),
        };
      });

    arrInfo.push(dataStaked);
  }
  return flattenDeep(arrInfo);
};

export const exportExcel = (dataArr, chain) => {
  console.log('🚀 ~ exportExcel ~ dataArr:', dataArr.length);

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(dataArr);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const desktopPath = path.join(os.homedir(), 'Desktop');
  const filePath = path.join(desktopPath, `output_${chain}.xlsx`);

  XLSX.writeFile(workbook, filePath);
};

export const convertWeiToBalance = (strValue, iDecimal = 18) => {
  try {
    if (strValue === '0') return '0';

    const decimalFormat = parseFloat(iDecimal);

    const multiplyNum = new bigdecimal.BigDecimal(Math.pow(10, decimalFormat));
    const convertValue = new bigdecimal.BigDecimal(String(strValue));
    const newValue = convertValue
      .divide(multiplyNum, decimalFormat, bigdecimal.RoundingMode.DOWN())
      .toString();

    return new BigNumber(newValue).toFixed();
  } catch (error) {
    return 0;
  }
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getPastLogsUnStake = async (data, web3) => {
  console.log('🚀 ~ await getPastLogs');
  if (data.chain !== 'ether') {
    const logs = await web3.eth.getPastLogs({
      fromBlock: data.fromBlockUnStake,
      toBlock: data.toBlock,
      address: data.addressContract, // Contract NFT
      topics: [
        '0x823fc0206464443571f97eb923196ee730df989f889f9542dff3a1741d55b653',
      ], // topic unstake
    });

    return logs;
  }
  // ether

  let fullResponse = [];

  const latestBlockNumber = await web3.eth
    .getBlock('latest')
    .then((item) => item.number)
    .catch(0);

  for (let i = data.fromBlockUnStake; i < latestBlockNumber; i += 50000) {
    const toBlock = i + 50000 >= latestBlockNumber ? 'latest' : i + 50000;

    const dataLog = await web3.eth.getPastLogs({
      fromBlock: i,
      toBlock: toBlock,
      address: data.addressContract, // Contract NFT
      topics: [
        '0x823fc0206464443571f97eb923196ee730df989f889f9542dff3a1741d55b653',
      ], // topic unstake
    });

    Array.prototype.push.apply(fullResponse, dataLog);
  }

  return fullResponse;
};

export const infoPackage = async (contract) => {
  const packageIds = [
    'JJDmBkGY8wlz8ng6qLBq',
    'QSBBPsup9KghrdobLzrd',
    'g5MuVTz0zIq99E0iBovg',
    'dEV5R98pnIKeJ7XhJ7eo',
    'unZbybKEWXIP5mFABx38',
    'f6SVWIOLkwIebW58orED',
    'LGW8XlN4ySGdKaC4owUu',
    'oLtdkzXsYh2uNwbiwxGe',
    'i10mXzCnwT7g07YSeBFg',
  ];

  const infoPackages = {};

  for (const itemPackage of packageIds) {
    infoPackages[itemPackage] = await contract.methods
      .PackageInfos(itemPackage)
      .call();
  }

  return infoPackages;
};

export const convertAprAmount = ({ apr, amountStaked, timeStaked }) => {
  const secondOneYear = new BigNumber(31536000);

  const bigNumberAPR = new BigNumber(apr);
  const bigNumberAmountStaked = new BigNumber(amountStaked);
  const bigNumberTimeStaked = new BigNumber(timeStaked);

  const amountPerSecond = bigNumberAPR
    .multipliedBy(bigNumberAmountStaked)
    .div(100)
    .div(secondOneYear);

  const amountPerTime = amountPerSecond.multipliedBy(bigNumberTimeStaked);
  return amountPerTime;
};

export const findBlockByTimestamp = async (
  targetTimestamp,
  chain = 'viction'
) => {
  console.log('🚀 ~ targetTimestamp:', targetTimestamp);
  const data = dataChain[chain] || dataChain.viction;
  const web3 = new Web3(data.rpc);
  // let currentBlock = await web3.eth.getBlockNumber();
  let currentBlock = 88205651;

  while (currentBlock > 0) {
    const block = await web3.eth.getBlock(currentBlock);
    console.log('🚀 ~ currentBlock:', currentBlock);

    if (block.timestamp <= targetTimestamp) {
      return currentBlock; // Trả về block gần nhất nhỏ hơn hoặc bằng timestamp
    }
    currentBlock = currentBlock - 1;
  }

  return null;
};

export const convertTimestamp = (number, type = 'DD/MM/YYYY HH:mm') => {
  let strTime;

  if (number) strTime = moment.unix(number).format(type);
  else strTime = moment().format(type);

  return strTime;
};
