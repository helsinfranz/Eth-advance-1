# Avax-Eth Assignment

Going to use deposit(),withdraw(),totalSupply,balanceOftoken functions using local network subnet.

## Description

Contract for creating a seperate wallet/vault for every player and letting player do some things with it.

## Getting Started

## Initialize

1. To get started, first pick a name for your Subnet.

``avalanche subnet create mySubnet``

Select ``SubnetEVM``
Select ``Use latest version``
Select ``Low disk use / Low Throughput 1.5 mil gas/s (C-Chain's setting)``
Select ``Airdrop 1 million tokens to the default address (do not use in production)``
select ``No``

 The command prints ``Successfully created subnet configuration``

To deploy your Subnet, run

``avalanche subnet deploy mySubnet``
 
 Next, select ``Local Network``
 
Now you will get your configurations just put them in your metamask wallet add manual network.

and then execute every thing with that configuration of metamask in your remix.


### Executing program

1. You need to deploy the ERC20.sol first.
2. Then, you need to deploy the Vault.sol contract after that but give it the address of already deployed contract in the above step.
3. Now in the first contract you need to mint some tokens and approve them to be transfered to the valut contract by giving it both the addresses and the amount.
4. Now, you can call the deposit and wothdraw functions of the main Vault contract and check them as stated in the contract.
