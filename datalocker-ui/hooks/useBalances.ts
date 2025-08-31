import { useQuery } from "@tanstack/react-query";
import { Synapse, TOKENS } from "@filoz/synapse-sdk";
import { useEthersProvider } from "@/hooks/useEthers";
import { useAccount } from "wagmi";
import { calculateStorageMetrics } from "@/utils/calculateStorageMetrics";
import { useNetwork } from "@/hooks/useNetwork";
import { formatUnits } from "viem";
import { defaultBalances, UseBalancesResponse } from "@/types";

/**
 * Hook to fetch and format wallet balances and storage metrics
 */
export const useBalances = () => {
  const provider = useEthersProvider();
  const { address } = useAccount();
  const { data: network } = useNetwork();

  const query = useQuery({
    enabled: !!address && !!provider && !!network,
    queryKey: ["balances", address, network],
    queryFn: async (): Promise<UseBalancesResponse> => {
      console.log("useBalances: Starting balance fetch", { address, network, provider: !!provider });
      
      if (!provider) {
        console.error("useBalances: Provider not found");
        throw new Error("Provider not found");
      }
      if (!network) {
        console.error("useBalances: Network not found");
        throw new Error("Network not found");
      }

      try {
        const synapse = await Synapse.create({ provider });
        console.log("useBalances: Synapse created successfully");

        // Fetch raw balances
        console.log("useBalances: Fetching balances...");
        const [filRaw, usdfcRaw, paymentsRaw] = await Promise.all([
          synapse.payments.walletBalance(),
          synapse.payments.walletBalance(TOKENS.USDFC),
          synapse.payments.balance(TOKENS.USDFC),
        ]);

        console.log("useBalances: Raw balances", {
          filRaw: filRaw.toString(),
          usdfcRaw: usdfcRaw.toString(),
          paymentsRaw: paymentsRaw.toString()
        });

        const usdfcDecimals = synapse.payments.decimals(TOKENS.USDFC);

        // Calculate storage metrics
        console.log("useBalances: Calculating storage metrics...");
        const storageMetrics = await calculateStorageMetrics(synapse);
        console.log("useBalances: Storage metrics", storageMetrics);

        const result = {
          filBalance: filRaw,
          usdfcBalance: usdfcRaw,
          filecoinWarmStorageBalance: paymentsRaw,
          filBalanceFormatted: formatBalance(filRaw, 18),
          usdfcBalanceFormatted: formatBalance(usdfcRaw, usdfcDecimals),
          filecoinWarmStorageBalanceFormatted: formatBalance(
            paymentsRaw,
            usdfcDecimals
          ),
          ...storageMetrics,
        };

        console.log("useBalances: Final result", result);
        return result;
      } catch (error) {
        console.error("useBalances: Error in queryFn", error);
        throw error;
      }
    },
    retry: false, // Disable retry for debugging
  });

  console.log("useBalances: Query state", {
    enabled: !!address && !!provider && !!network,
    address: !!address,
    provider: !!provider,
    network: !!network,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error
  });

  return {
    ...query,
    data: query.data || defaultBalances,
  };
};

/**
 * Formats a balance value with specified decimals
 */
export const formatBalance = (balance: bigint, decimals: number): number => {
  return Number(Number(formatUnits(balance, decimals)).toFixed(5));
};
