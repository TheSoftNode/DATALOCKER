import { task } from "hardhat/config";

task("get-address", "Get the deployer address in both Ethereum and Filecoin formats")
  .setAction(async (_, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const ethAddress = await deployer.getAddress();
    
    console.log("Ethereum Address:", ethAddress);
    console.log("Filecoin Address (f4/t4):", `f4${ethAddress.slice(2)}`);
    console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(ethAddress)), "FIL");
  });
