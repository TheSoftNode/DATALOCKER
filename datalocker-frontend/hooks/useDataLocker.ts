import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { ethers } from "ethers";
import { useEthersSigner, useEthersProvider } from "./useEthers";
import { DATALOCKER_ADDRESSES, DATALOCKER_CONFIG } from "@/config";
import DataLockerABI from "@/contracts/DataLocker.json";

export type PaymentToken = "FIL" | "USDFC";

export interface StorageRecord {
  storageId: string;
  pieceCid: string;
  pieceSize: string;
  user: string;
  depositAmount: string;
  usedAmount: string;
  expirationEpoch: string;
  dealId: string;
  isActive: boolean;
  label: string;
  paymentToken: PaymentToken;
  lastRenewalEpoch: string;
  ipfsHash: string;
}

/**
 * Hook for interacting with DataLocker contract
 */
export const useDataLocker = () => {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const provider = useEthersProvider();
  const queryClient = useQueryClient();

  // Get contract instance
  const getContract = () => {
    if (!signer) throw new Error("Signer not available");
    return new ethers.Contract(
      DATALOCKER_ADDRESSES.DATALOCKER_CONTRACT,
      DataLockerABI.abi,
      signer
    );
  };

  const getReadOnlyContract = () => {
    if (!provider) throw new Error("Provider not available");
    return new ethers.Contract(
      DATALOCKER_ADDRESSES.DATALOCKER_CONTRACT,
      DataLockerABI.abi,
      provider
    );
  };

  // Deposit for storage with FIL
  const depositFIL = useMutation({
    mutationFn: async ({
      file,
      label,
      ipfsHash,
      filAmount,
    }: {
      file: File;
      label: string;
      ipfsHash: string;
      filAmount: string;
    }) => {
      const contract = getContract();
      
      // Convert file to bytes for pieceCid
      const arrayBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);
      
      const tx = await contract.depositForStorageFIL(
        fileBytes,
        file.size,
        label,
        ipfsHash,
        {
          value: ethers.parseEther(filAmount),
        }
      );
      
      return tx;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["userStorageRecords"] });
      queryClient.invalidateQueries({ queryKey: ["contractBalance"] });
    },
  });

  // Deposit for storage with USDFC
  const depositUSDFC = useMutation({
    mutationFn: async ({
      file,
      label,
      ipfsHash,
      usdfcAmount,
    }: {
      file: File;
      label: string;
      ipfsHash: string;
      usdfcAmount: string;
    }) => {
      const contract = getContract();
      
      // Convert file to bytes for pieceCid
      const arrayBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);
      
      const tx = await contract.depositForStorageUSDFC(
        fileBytes,
        file.size,
        label,
        ipfsHash,
        ethers.parseUnits(usdfcAmount, 6) // USDFC has 6 decimals
      );
      
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStorageRecords"] });
      queryClient.invalidateQueries({ queryKey: ["contractBalance"] });
    },
  });

  // Get user storage records
  const {
    data: userStorageRecords,
    isLoading: isLoadingRecords,
    error: recordsError,
  } = useQuery({
    queryKey: ["userStorageRecords", address],
    queryFn: async () => {
      if (!address) return [];
      
      const contract = getReadOnlyContract();
      
      // Get storage IDs for user
      const storageIds = await contract.getUserStorageIds(address);
      
      // Get detailed info for each storage
      const records = await Promise.all(
        storageIds.map(async (id: bigint) => {
          const info = await contract.getStorageInfo(id);
          return {
            storageId: id.toString(),
            pieceCid: info.pieceCid,
            pieceSize: info.pieceSize.toString(),
            user: info.user,
            depositAmount: info.depositAmount.toString(),
            usedAmount: info.usedAmount.toString(),
            expirationEpoch: info.expirationEpoch.toString(),
            dealId: info.dealId.toString(),
            isActive: info.isActive,
            label: info.label,
            paymentToken: info.paymentToken === 0 ? "FIL" : "USDFC",
            lastRenewalEpoch: info.lastRenewalEpoch.toString(),
            ipfsHash: info.ipfsHash,
          } as StorageRecord;
        })
      );
      
      return records;
    },
    enabled: !!address && !!provider,
  });

  // Get contract balance info
  const {
    data: contractBalance,
    isLoading: isLoadingBalance,
  } = useQuery({
    queryKey: ["contractBalance"],
    queryFn: async () => {
      const contract = getReadOnlyContract();
      const balanceInfo = await contract.getBalanceInfo();
      
      return {
        totalBalanceFIL: ethers.formatEther(balanceInfo[0]),
        escrowBalanceFIL: ethers.formatEther(balanceInfo[1]),
        availableBalanceFIL: ethers.formatEther(balanceInfo[2]),
        totalBalanceUSDFC: ethers.formatUnits(balanceInfo[3], 6),
        escrowBalanceUSDFC: ethers.formatUnits(balanceInfo[4], 6),
        availableBalanceUSDFC: ethers.formatUnits(balanceInfo[5], 6),
      };
    },
    enabled: !!provider,
  });

  // Get renewal queue
  const {
    data: renewalQueue,
    isLoading: isLoadingRenewalQueue,
  } = useQuery({
    queryKey: ["renewalQueue"],
    queryFn: async () => {
      const contract = getReadOnlyContract();
      const queue = await contract.getRenewalQueue();
      return queue.map((id: bigint) => id.toString());
    },
    enabled: !!provider,
  });

  // Withdraw unused funds
  const withdrawFunds = useMutation({
    mutationFn: async (storageId: string) => {
      const contract = getContract();
      const tx = await contract.withdrawUnusedFunds(storageId);
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStorageRecords"] });
      queryClient.invalidateQueries({ queryKey: ["contractBalance"] });
    },
  });

  // Check and renew storage
  const renewStorage = useMutation({
    mutationFn: async (storageId: string) => {
      const contract = getContract();
      const tx = await contract.checkAndRenewStorage(storageId);
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStorageRecords"] });
      queryClient.invalidateQueries({ queryKey: ["renewalQueue"] });
    },
  });

  // Helper functions
  const formatStorageSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatTimeRemaining = (expirationEpoch: string) => {
    const expiry = parseInt(expirationEpoch);
    const currentEpoch = Math.floor(Date.now() / 1000 / 30); // 30-second epochs
    const epochsRemaining = expiry - currentEpoch;
    const daysRemaining = epochsRemaining / DATALOCKER_CONFIG.EPOCHS_PER_DAY;
    
    if (daysRemaining <= 0) return "Expired";
    if (daysRemaining < 1) return `${Math.floor(daysRemaining * 24)} hours`;
    return `${Math.floor(daysRemaining)} days`;
  };

  const getStorageStatus = (record: StorageRecord) => {
    if (!record.isActive) return "Inactive";
    
    const expiry = parseInt(record.expirationEpoch);
    const currentEpoch = Math.floor(Date.now() / 1000 / 30);
    const epochsRemaining = expiry - currentEpoch;
    const daysRemaining = epochsRemaining / DATALOCKER_CONFIG.EPOCHS_PER_DAY;
    
    if (daysRemaining <= 0) return "Expired";
    if (daysRemaining <= DATALOCKER_CONFIG.RENEWAL_THRESHOLD) return "Renewal Needed";
    return "Active";
  };

  return {
    // Mutations
    depositFIL,
    depositUSDFC,
    withdrawFunds,
    renewStorage,
    
    // Queries
    userStorageRecords,
    isLoadingRecords,
    recordsError,
    contractBalance,
    isLoadingBalance,
    renewalQueue,
    isLoadingRenewalQueue,
    
    // Helpers
    formatStorageSize,
    formatTimeRemaining,
    getStorageStatus,
  };
};
