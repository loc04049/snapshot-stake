import Web3 from 'web3';
import stakeAbi from './stakeAbi.js';
import {
  convertAprAmount,
  convertTimestamp,
  convertWeiToBalance,
  dataChain,
  exportExcel,
  getInfoNftStake,
  getPastLogs,
  infoPackage,
  sleep,
  typeExportSnap,
} from './function.js';
import BigNumber from 'bignumber.js';

export const getDataStaked = async (chain = 'viction') => {
  const data = dataChain[chain] || dataChain.viction;
  const web3 = new Web3(data.rpc);
  const contract = new web3.eth.Contract(stakeAbi, data.addressContract);

  try {
    const logs = await getPastLogs({
      data,
      web3,
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // topic send nft
      ],
      name: typeExportSnap.staked,
    });
    const tokenHolders = {};

    logs.forEach((log) => {
      const to = `0x${log.topics[2].slice(26)}`; // Lấy địa chỉ "to" từ topic[2]
      const tokenId = web3.utils.hexToNumberString(log.topics[3]); // Lấy tokenId từ topic[3]
      // Gán người nhận là holder của token
      tokenHolders[tokenId] = to;
    });

    const dataStaked = await getInfoNftStake({
      chain,
      contract,
      arrNFT: tokenHolders,
    });

    exportExcel({ dataArr: dataStaked, chain, name: 'staking_360' });
  } catch (error) {
    console.error('Error fetching logs:', error);
  }
};

export const getDataUnStake = async (chain = 'viction') => {
  const data = dataChain[chain] || dataChain.viction;
  const web3 = new Web3(data.rpc);
  const contract = new web3.eth.Contract(stakeAbi, data.addressContract);

  try {
    const infoPackages = await infoPackage(contract);
    if (chain === 'bsc') {
      await sleep(200);
    }

    const arrInfo = [];

    const logs = await getPastLogs({
      data,
      web3,
      topics: [
        '0x823fc0206464443571f97eb923196ee730df989f889f9542dff3a1741d55b653', // topic unstake
      ],
      name: typeExportSnap.unStake,
    });

    for (const log of logs) {
      const nftId = web3.utils.hexToNumberString(log.data.slice(0, 66));
      const hash = log?.transactionHash;
      const infoHash = await web3.eth.getTransaction(hash);
      if (chain === 'bsc') {
        await sleep(200);
      }
      const addressFrom = infoHash.from;
      const dataInfoStake = await contract.methods.getStakedInfo(nftId).call();
      const infoPackageID = infoPackages[dataInfoStake.packageID];

      const timeStaked = new BigNumber(dataInfoStake.rate).minus(
        new BigNumber(dataInfoStake.time)
      );

      const isClaimFullRate = timeStaked.isGreaterThanOrEqualTo(
        infoPackageID.time
      );

      const earnStaked = new BigNumber(dataInfoStake.claim_pending_time).minus(
        new BigNumber(dataInfoStake.amount)
      );

      const amountFullRate = convertAprAmount({
        apr: new BigNumber(infoPackageID.rate).div(100),
        amountStaked: dataInfoStake.amount,
        timeStaked: timeStaked,
      });

      arrInfo.push({
        nftId,
        hashUnStake: hash,
        isClaimFullRate,
        timeStake: convertTimestamp(dataInfoStake.time),
        timeUnStake: convertTimestamp(dataInfoStake.rate), // err contract rate = time claimed
        rate: new BigNumber(infoPackageID.rate).div(100) + '%',
        amountStake: convertWeiToBalance(dataInfoStake.amount),
        earnStaked: convertWeiToBalance(earnStaked),
        totalClaimed: convertWeiToBalance(dataInfoStake.claim_pending_time), // err contract claim_pending_time = total claim
        addressOwner: addressFrom,
        amountSetVault: isClaimFullRate
          ? 0
          : convertWeiToBalance(amountFullRate.minus(earnStaked)),
      });
    }

    exportExcel({ dataArr: arrInfo, chain, name: 'unstake_18_12_360' });
  } catch (error) {
    console.error('Error fetching logs:', error);
  }
};
