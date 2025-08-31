import { useMutation } from "@tanstack/react-query";
import { useEthersSigner } from "@/hooks/useEthers";
import { useState } from "react";
import { useConfetti } from "@/hooks/useConfetti";
import { useNetwork } from "@/hooks/useNetwork";
import { Synapse, TOKENS, CONTRACT_ADDRESSES } from "@filoz/synapse-sdk";
import { DATA_SET_CREATION_FEE, MAX_UINT256, getDataset } from "@/utils";
import { useAccount } from "wagmi";

/**
 * Hook to handle payment for storage
 * @param lockup - The lockup amount to be used for the storage
 * @param epochRate - The epoch rate to be used for the storage
 * @param depositAmount - The deposit amount to be used for the storage
 * @notice LockUp is the accoumulated amount of USDFC that the user has locked up for Storing data over time.
 * It is different from the depositAmount. Which is the amount needed to pay for more storage if required.
 * @returns Mutation and status
 */
export const usePayment = () => {
  const signer = useEthersSigner();
  const [status, setStatus] = useState<string>("");
  const { triggerConfetti } = useConfetti();
  const { data: network } = useNetwork();
  const { address } = useAccount();
  const mutation = useMutation({
    mutationFn: async ({
      lockupAllowance,
      epochRateAllowance,
      depositAmount,
    }: {
      lockupAllowance: bigint;
      epochRateAllowance: bigint;
      depositAmount: bigint;
    }) => {
      if (!signer) throw new Error("Signer not found");
      if (!network) throw new Error("Network not found");
      if (!address) throw new Error("Address not found");
      const paymentsAddress = CONTRACT_ADDRESSES.PAYMENTS[network];

      setStatus("🔄 Preparing transaction...");
      const synapse = await Synapse.create({
        signer,
        disableNonceManager: false,
      });

      const { dataset } = await getDataset(synapse, address);

      const hasDataset = !!dataset;

      const fee = hasDataset ? BigInt(0) : DATA_SET_CREATION_FEE;

      const amount = depositAmount + fee;

      const allowance = await synapse.payments.allowance(
        TOKENS.USDFC,
        paymentsAddress
      );

      const balance = await synapse.payments.walletBalance(TOKENS.USDFC);

      if (balance < amount) {
        throw new Error("Insufficient USDFC balance");
      }

      if (allowance < MAX_UINT256 / BigInt(2)) {
        setStatus("💰 Approving USDFC to cover storage costs...");
        console.log("Starting USDFC approval transaction...");
        try {
          const transaction = await synapse.payments.approve(
            TOKENS.USDFC,
            paymentsAddress,
            MAX_UINT256
          );
          console.log("USDFC approval transaction sent:", transaction.hash);
          const receipt = await transaction.wait();
          console.log("USDFC approval transaction confirmed:", receipt);
          setStatus("💰 Successfully approved USDFC to cover storage costs");
        } catch (error) {
          console.error("USDFC approval failed:", error);
          throw new Error(`USDFC approval failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      if (amount > BigInt(0)) {
        setStatus("💰 Depositing USDFC to cover storage costs...");
        console.log("Starting USDFC deposit transaction...", { amount: amount.toString() });
        try {
          const transaction = await synapse.payments.deposit(amount);
          console.log("USDFC deposit transaction sent:", transaction.hash);
          const receipt = await transaction.wait();
          console.log("USDFC deposit transaction confirmed:", receipt);
          setStatus("💰 Successfully deposited USDFC to cover storage costs");
        } catch (error) {
          console.error("USDFC deposit failed:", error);
          throw new Error(`USDFC deposit failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      setStatus(
        "💰 Approving Filecoin Warm Storage service USDFC spending rates..."
      );
      console.log("Starting service approval transaction...", { 
        epochRateAllowance: epochRateAllowance.toString(),
        lockupAmount: (lockupAllowance + fee).toString()
      });
      try {
        const transaction = await synapse.payments.approveService(
          synapse.getPandoraAddress(),
          epochRateAllowance,
          lockupAllowance + fee
        );
        console.log("Service approval transaction sent:", transaction.hash);
        const receipt = await transaction.wait();
        console.log("Service approval transaction confirmed:", receipt);
        setStatus(
          "💰 Successfully approved Filecoin Warm Storage spending rates"
        );
      } catch (error) {
        console.error("Service approval failed:", error);
        throw new Error(`Service approval failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    onSuccess: () => {
      setStatus("✅ Payment was successful!");
      triggerConfetti();
    },
    onError: (error) => {
      console.error("Payment failed:", error);
      setStatus(
        `❌ ${error.message || "Transaction failed. Please try again."}`
      );
    },
  });
  return { mutation, status };
};
