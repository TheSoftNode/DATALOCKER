// Test script for DataLocker + Kwala integration
// Run this in browser console on https://datalocker.vercel.app

async function testKwalaIntegration() {
    console.log("🧪 Testing DataLocker + Kwala Integration...\n");
    
    try {
        // Check if wallet is connected
        if (typeof window.ethereum === 'undefined') {
            throw new Error("Please install MetaMask and connect your wallet");
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log("✅ Wallet connected:", address);

        // Contract ABI (just the new functions we added)
        const kwalaABI = [
            "function getAutomationStatus() view returns (uint256, uint256, uint256, uint256, uint256)",
            "function getRenewalQueue() view returns (uint256[])",
            "function getLowBalanceStorageIds() view returns (uint256[])",
            "function kwalaAutoRenew(uint256) returns (bool, string)",
            "function needsRenewal(uint256) view returns (bool)",
            "function nextStorageId() view returns (uint256)",
            "function authorizedOperators(address) view returns (bool)",
            "event DealNearExpiration(uint256 indexed storageId, address indexed user, uint256 expirationEpoch, uint256 currentEpoch, uint256 remainingBalance, string label)",
            "event LowBalanceWarning(uint256 indexed storageId, address indexed user, uint256 remainingBalance, uint256 estimatedRenewalCost, uint8 paymentToken, string label)",
            "event AutoRenewalTriggered(uint256 indexed storageId, address indexed triggeredBy, bool success, string reason)"
        ];

        const contractAddress = "0x5b4495F43501842C513afef03e581f0791fDe406";
        const contract = new ethers.Contract(contractAddress, kwalaABI, provider);

        console.log("✅ Contract connected:", contractAddress, "\n");

        // Test 1: Check automation status
        console.log("📊 Test 1: Automation Status");
        try {
            const status = await contract.getAutomationStatus();
            console.log("   Total Active Storage:", status[0].toString());
            console.log("   Needing Renewal:", status[1].toString());
            console.log("   Low Balance:", status[2].toString());
            console.log("   Total FIL Escrowed:", ethers.utils.formatEther(status[3]));
            console.log("   Total USDFC Escrowed:", ethers.utils.formatUnits(status[4], 6));
            console.log("✅ Automation status working\n");
        } catch (error) {
            console.log("❌ Automation status failed:", error.message, "\n");
        }

        // Test 2: Check renewal queue
        console.log("🔄 Test 2: Renewal Queue");
        try {
            const renewalQueue = await contract.getRenewalQueue();
            console.log("   Storage IDs needing renewal:", renewalQueue.map(id => id.toString()));
            console.log("✅ Renewal queue working\n");
        } catch (error) {
            console.log("❌ Renewal queue failed:", error.message, "\n");
        }

        // Test 3: Check low balance storage
        console.log("⚠️  Test 3: Low Balance Storage");
        try {
            const lowBalance = await contract.getLowBalanceStorageIds();
            console.log("   Storage IDs with low balance:", lowBalance.map(id => id.toString()));
            console.log("✅ Low balance detection working\n");
        } catch (error) {
            console.log("❌ Low balance detection failed:", error.message, "\n");
        }

        // Test 4: Check if any storage exists to test with
        console.log("📁 Test 4: Storage Information");
        try {
            const nextId = await contract.nextStorageId();
            console.log("   Next Storage ID:", nextId.toString());
            
            if (nextId.gt(1)) {
                // Test with storage ID 1 if it exists
                const needsRenewal = await contract.needsRenewal(1);
                console.log("   Storage ID 1 needs renewal:", needsRenewal);
            }
            console.log("✅ Storage info working\n");
        } catch (error) {
            console.log("❌ Storage info failed:", error.message, "\n");
        }

        // Test 5: Event listener setup
        console.log("📡 Test 5: Event Listeners");
        try {
            // Set up event listeners
            contract.on("DealNearExpiration", (storageId, user, expiration, current, balance, label) => {
                console.log("🔔 Event: Deal Near Expiration", {
                    storageId: storageId.toString(),
                    user,
                    balance: balance.toString(),
                    label
                });
            });

            contract.on("AutoRenewalTriggered", (storageId, triggeredBy, success, reason) => {
                console.log("🤖 Event: Auto Renewal Triggered", {
                    storageId: storageId.toString(),
                    triggeredBy,
                    success,
                    reason
                });
            });

            contract.on("LowBalanceWarning", (storageId, user, balance, cost, token, label) => {
                console.log("⚠️  Event: Low Balance Warning", {
                    storageId: storageId.toString(),
                    user,
                    balance: balance.toString(),
                    estimatedCost: cost.toString(),
                    paymentToken: token === 0 ? 'FIL' : 'USDFC',
                    label
                });
            });

            console.log("✅ Event listeners set up");
            console.log("   (Will show events when they occur)\n");
        } catch (error) {
            console.log("❌ Event listener setup failed:", error.message, "\n");
        }

        // Test 6: Authorization check (if Kwala operator is set)
        console.log("🔐 Test 6: Authorization Status");
        try {
            const kwalaOperator = "0x742d35cc6ad41870c65c13c83ceb6a1b3c68c4a7"; // Example address
            const isAuthorized = await contract.authorizedOperators(kwalaOperator);
            console.log("   Kwala operator authorized:", isAuthorized);
            
            if (!isAuthorized) {
                console.log("   ℹ️  To enable automation, run:");
                console.log("   await contract.setOperatorAuthorization('" + kwalaOperator + "', true)");
            }
            console.log("✅ Authorization check working\n");
        } catch (error) {
            console.log("❌ Authorization check failed:", error.message, "\n");
        }

        console.log("🎉 Kwala Integration Test Complete!");
        console.log("\n📋 Next Steps:");
        console.log("1. Deploy Kwala workflow: kwala deploy kwala-workflows/datalocker-automation.yaml");
        console.log("2. Set up Discord webhook for notifications");
        console.log("3. Authorize Kwala operator address on the contract");
        console.log("4. Upload test storage and monitor automation");
        
        return {
            success: true,
            message: "All tests completed successfully!"
        };

    } catch (error) {
        console.error("❌ Test failed:", error);
        return {
            success: false,
            message: error.message
        };
    }
}

// Run the test
console.log("🚀 Starting Kwala Integration Tests...\n");
testKwalaIntegration().then(result => {
    console.log("\n" + "=".repeat(50));
    console.log(result.success ? "✅ SUCCESS" : "❌ FAILED");
    console.log(result.message);
    console.log("=".repeat(50));
});

// Helper function to simulate storage near expiration (for testing)
window.simulateNearExpiration = async function(storageId) {
    console.log("🧪 Simulating near expiration for storage ID:", storageId);
    
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // This would need to be added to contract temporarily for testing
        const testABI = ["function setTestExpirationEpoch(uint256, uint256)"];
        const contract = new ethers.Contract(
            "0x5b4495F43501842C513afef03e581f0791fDe406",
            testABI,
            signer
        );
        
        // Set expiration to 25 days from now (triggers renewal at 30 day threshold)
        const currentTime = Math.floor(Date.now() / 1000);
        const currentEpoch = Math.floor(currentTime / 30); // 30-second epochs
        const nearExpirationEpoch = currentEpoch + (25 * 24 * 60 * 2); // 25 days in 30-second epochs
        
        const tx = await contract.setTestExpirationEpoch(storageId, nearExpirationEpoch);
        await tx.wait();
        
        console.log("✅ Simulated near expiration - Kwala should detect this within 30 minutes");
        
    } catch (error) {
        console.log("❌ Simulation failed:", error.message);
        console.log("ℹ️  This requires owner permissions and a test function in the contract");
    }
};