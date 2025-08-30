/*
    This is the configuration for the DataLocker dApp using Synapse.
    It is used to configure the storage capacity, the persistence period, and the minimum number of days of lockup needed so the app can notify to pay for more storage.
*/

export const config = {
  // The number of GB of storage capacity needed to be sufficient
  storageCapacity: 10,
  // The number of days of lockup needed to be sufficient (6 months for perpetual storage)
  persistencePeriod: 180,
  // The minimum number of days of lockup needed to be sufficient
  minDaysThreshold: 30,
  // Whether to use CDN for the storage for faster retrieval
  withCDN: true,
} satisfies {
  storageCapacity: number;
  persistencePeriod: number;
  minDaysThreshold: number;
  withCDN: boolean;
};

// Production DataLocker Contract Addresses (Calibration Testnet)
export const DATALOCKER_ADDRESSES = {
  // TODO: Update this with your deployed DataLocker contract address after funding deployer
  DATALOCKER_CONTRACT: "0x0000000000000000000000000000000000000000", // PLACEHOLDER - DEPLOY AFTER FUNDING
  
  // Production SynapseSDK addresses
  USDFC_TOKEN: "0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0",
  PAYMENTS_CONTRACT: "0x0E690D3e60B0576D01352AB03b258115eb84A047",
  PANDORA_SERVICE: "0xf49ba5eaCdFD5EE3744efEdf413791935FE4D4c5",
  PDP_VERIFIER: "0x5A23b7df87f59A291C26A2A1d684AD03Ce9B68DC",
} as const;

// DataLocker specific configuration
export const DATALOCKER_CONFIG = {
  STORAGE_DURATION: 180, // days (6 months)
  RENEWAL_THRESHOLD: 30, // days before expiry to trigger renewal
  MIN_DEPOSIT_FIL: 1, // FIL
  MIN_DEPOSIT_USDFC: 100, // USDFC
  EPOCHS_PER_DAY: 2880, // 30-second epochs per day
} as const;
