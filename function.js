import flattenDeep from 'lodash/flattenDeep.js';
import os from 'os';
import path from 'path';
import XLSX from 'xlsx';
import bigdecimal from 'bigdecimal';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import moment from 'moment';

export const timeEndReward = 1735574400; // 11:00 PM 30/12/2024 GMT+7

export const typeExportSnap = {
  staked: 'Staked',
  unStake: 'UnStake',
};

export const dataChain = {
  viction: {
    rpc: 'https://rpc5.viction.xyz',
    addressContract: '0xb1B7c19c9C919346390a1E40aaBCED8A66b53C06',
    chain: 'viction',

    fromBlockStaked: 72525940,
    toBlockStaked: 'latest',

    fromBlockUnStake: 88205602, //11:05 PM 18/12/2024 GMT+7
    toBlockUnStake: 88648366,
  },
  bsc: {
    rpc: 'https://bscrpc.com',
    addressContract: '0x08ac9c38ce078b9b81e5ab5bf8aafc3d2db94385',
    chain: 'bsc',

    fromBlockStaked: 13457759,
    toBlockStaked: 'latest',

    fromBlockUnStake: 44985630,
    toBlockUnStake: 'latest',
  },
  ether: {
    rpc: 'https://ethereum.publicnode.com',
    addressContract: '0x836bf46520C373Fdc4dc7E5A3bAe735d13bD44e3',
    chain: 'ether',

    fromBlockStaked: 13803141,
    toBlockStaked: 'latest',

    fromBlockUnStake: 21430492,
    toBlockUnStake: 'latest',
  },
};

export const getPastLogs = async ({
  data,
  web3,
  topics,
  name = typeExportSnap.staked,
}) => {
  const fromBlock = data[`fromBlock${name}`];
  const toBlock = data[`toBlock${name}`];

  console.log('🚀 ~ await getPastLogs' + name);
  if (data.chain !== 'ether') {
    const logs = await web3.eth.getPastLogs({
      fromBlock,
      toBlock,
      address: data.addressContract, // Contract NFT
      topics,
      // topics: [
      //   '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      // ], // topic send nft
    });

    return logs;
  }
  // ether

  let fullResponse = [];

  const latestBlockNumber =
    toBlock !== 'latest'
      ? toBlock
      : await web3.eth
          .getBlock('latest')
          .then((item) => item.number)
          .catch(0);

  for (let i = fromBlock; i < latestBlockNumber; i += 50000) {
    const newToBlock =
      i + 50000 >= latestBlockNumber ? latestBlockNumber : i + 50000;

    const dataLog = await web3.eth.getPastLogs({
      fromBlock: i,
      toBlock: newToBlock,
      address: data.addressContract, // Contract NFT
      topics,
    });

    Array.prototype.push.apply(fullResponse, dataLog);
  }

  return fullResponse;
};

export const getInfoNftStake = async ({ chain, contract, arrNFT }) => {
  console.log('🚀 ~ await get info getInfoNftStake');

  // uniq address
  const addressList = [...new Set(Object.values(arrNFT))];

  const arrInfo = [];

  for (const addressHolder of addressList) {
    // const arrInfo = await Promise.all(addressList.map(async addressHolder => {

    if (chain === 'bsc') {
      await sleep(200);
    }
    const dataLog = await contract.methods.walletOfOwner(addressHolder).call();

    const dataStaked = dataLog
      .filter((itemLog) => itemLog.flag && !itemLog.pending_flag)
      .map((itemMap) => {
        const newEstStaked = new BigNumber(itemMap.est_staked);
        const newAmountStake = new BigNumber(itemMap.amount);
        const timeStaked = new BigNumber(timeEndReward).minus(
          new BigNumber(itemMap.time)
        );

        const amountEarnFullRate = convertAprAmount({
          apr: new BigNumber(itemMap.rate).div(100),
          amountStaked: newAmountStake,
          timeStaked: timeStaked,
        });

        return {
          id: itemMap.id,
          rate: new BigNumber(itemMap.rate).div(100) + '%',
          amountStaked: convertWeiToBalance(newAmountStake.toFixed()),
          amount_earn_contract: convertWeiToBalance(newEstStaked.toFixed()),
          amount_earn_full_rate: convertWeiToBalance(amountEarnFullRate),
          addressHolder,
          totalAmountSetVault: convertWeiToBalance(
            newAmountStake.plus(amountEarnFullRate).toFixed()
          ),
        };
      });

    arrInfo.push(dataStaked);
  }
  return flattenDeep(arrInfo);
};

export const exportExcel = ({ dataArr, chain, name = 'stake' }) => {
  console.log('🚀 ~ exportExcel ~ dataArr:', dataArr.length);

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(dataArr);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const desktopPath = path.join(os.homedir(), 'Desktop');
  const filePath = path.join(desktopPath, `export_${name}_${chain}.xlsx`);

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
  const secondOneYear = new BigNumber(31104000); // 360 ngày

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
  let currentBlock = 88659880;

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
