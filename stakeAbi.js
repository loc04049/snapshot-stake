export default [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'walletOfOwner',
    outputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'pending_flag',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'flag',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'time',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'packageID',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'isCustomID',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'meta',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'package_time',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'pending_time',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'unstaked_time',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'claim_pending_time',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'earn_staked',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'est_staked',
            type: 'uint256',
          },
        ],
        internalType: 'struct Coin98Stake.StakeInfo[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getStakedInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'pending_flag',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'flag',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'time',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'packageID',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'isCustomID',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'stake_token',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'reward_token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'package_time',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'pending_time',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'unstaked_time',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'claim_pending_time',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'earn_staked',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'est_staked',
            type: 'uint256',
          },
        ],
        internalType: 'struct Coin98Stake.StakeInfo',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '', type: 'string' }],
    name: 'PackageInfos',
    outputs: [
      { internalType: 'address', name: 'meta', type: 'address' },
      { internalType: 'uint256', name: 'min', type: 'uint256' },
      { internalType: 'uint256', name: 'max', type: 'uint256' },
      { internalType: 'uint256', name: 'time', type: 'uint256' },
      { internalType: 'uint256', name: 'rate', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
