import Web3 from 'web3';
import stakeAbi from './stakeAbi.js';
import { dataChain, exportExcel, getInfoNftStake, getPastLogs } from './function.js';

export const getDataStaked = async (chain = 'viction') => {
  const data = dataChain[chain] || dataChain.viction
  const web3 = new Web3(data.rpc);
  const contract = new web3.eth.Contract(stakeAbi, data.addressContract)

  try {

    const logs = await getPastLogs(data, web3)
    const tokenHolders = {};

    logs.forEach((log) => {
      const to = `0x${log.topics[2].slice(26)}`; // Lấy địa chỉ "to" từ topic[2]
      const tokenId = web3.utils.hexToNumberString(log.topics[3]); // Lấy tokenId từ topic[3]
      // Gán người nhận là holder của token
      tokenHolders[tokenId] = to;
    });

    const dataStaked = await getInfoNftStake({contract, arrNFT: tokenHolders })

    exportExcel(dataStaked, chain)

  } catch (error) {
    console.error('Error fetching logs:', error);
  }
};

