import { useState, useEffect } from "react";
import { ethers } from "ethers";
import vesting_contract_abi from "../../artifacts/TokenVesting.json";
import Link from "next/link";

export default function organization_client_token_allotment_page() {
  const [account, setAccount] = useState(undefined);
  const [ethwallet, setEthallet] = useState(undefined);
  const [info, setInfo] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [smartcontract, setSmartcontract] = useState(undefined);
  const [client_name, setClient_name] = useState(undefined);
  const [search_client_address, setSearch_client_address] = useState(undefined);
  const [client_access_level, setClient_access_level] = useState(undefined);
  const [client_balance, setClient_balance] = useState(undefined);
  const [client_token_qty, setClient_token_qty] = useState(undefined);
  const [client_token_locktime, setClient_token_locktime] = useState(undefined);

  const contract_ABI = vesting_contract_abi.abi;
  const contract_address = "0x707c950818693F544074f6cf394021ac50a85F77";
  let num = 0;

  const initprocess = async () => {
    if (window.ethereum) {
      setEthallet(window.ethereum);
      console.log(`Ethereum instance found`);
    }
    walletConnectionHandler();
  };

  const walletConnectionHandler = async () => {
    if (ethwallet) {
      ethwallet
        .request({ method: "eth_accounts" })
        .then((result) => {
          accountHandler(result[0]);
        })
        .catch((error) => {
          setError(error);
          console.log(error);
        });
    }
  };
  const accountHandler = async (wal_account) => {
    if (wal_account) {
      console.log(`account connected ac is ${wal_account}`);
      setAccount(wal_account);
    } else {
      console.log(`account not found ${wal_account}`);
    }
  };

  const smartcontractConnectionHandler = async () => {
    const provider = new ethers.providers.Web3Provider(ethwallet);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contract_address,
      contract_ABI,
      signer
    );
    setSmartcontract(contract);
  };

  const allotTokenToClient = async () => {
    smartcontractConnectionHandler();
    if (smartcontract) {
      const value = await smartcontract.msgg();
      console.log(`here is the output of user account address msg ${value} `);
      const value1 = await smartcontract._allot_token(
        account,
        search_client_address,
        ethers.BigNumber.from(client_token_qty),
        ethers.BigNumber.from(client_token_locktime)
      );
      console.log(`here is the output of setowner ${value1}`);
    }
  };

  const searchClient = async (value) => {
    setSearch_client_address(value);
  };

  const readInputs = async (text, option) => {
    if (option == "1") {
      setClient_token_qty(text);
    }
    if (option == "2") {
      let value = parseInt(text);
      value += Math.round(Date.now() / 1000);

      setClient_token_locktime(value);
    }
    setInfo("Please Recheck your Entered information.");
    console.log(
      `the client token is qty ${client_token_qty} client vesting period is in sec ${client_token_locktime}`
    );
  };

  const InfoCheck = async () => {
    smartcontractConnectionHandler();

    if (smartcontract) {
      let id = await smartcontract._get_my_id(account, search_client_address);
      console.log(
        `the client id is ${id} for account ${search_client_address}`
      );

      const [access_level, clientName, balance, unlock] =
        await smartcontract._show_client_info(
          account,
          search_client_address,
          ethers.BigNumber.from(id)
        );
      console.log(
        `here is the output of admininfo access_level = ${access_level} Client_name = ${clientName} Client Balance = ${balance} client token_UnLocktime is ${client_token_locktime}`
      );
      const value = access_level;
      console.log(
        `here is the output of admininfo access_level = ${typeof value}`
      );
      if (access_level) {
        console.log(`yes name is ${clientName}`);
        console.log(
          `yes access level is ${typeof parseInt(
            access_level._hex,
            16
          ).toString()}`
        );
        setClient_access_level(parseInt(access_level._hex, 16).toString());
        setClient_name(clientName);
        setClient_balance(parseInt(balance._hex, 16).toString());
        setClient_token_locktime(parseInt(unlock._hex, 16).toString());
      }
    }
  };

  const form_fields = () => {
    if (client_access_level != undefined) {
      console.log(`client_access-level is not undefined`);
      return (
        <>
          <br></br>
          <div>
            <p>Enter Your Client Token Quantity</p>
            <input onChange={(e) => readInputs(e.target.value, 1)} />
            <br></br>
            <p>
              Enter Your Client vesting period in (sec), current time with
              entered value is ={" "}
              {parseInt(client_token_locktime - Math.round(Date.now() / 1000)) +
                Math.round(Date.now() / 1000)}
            </p>
            <div className="footer">
              <input onChange={(e) => readInputs(e.target.value, 2)} />
              <button onClick={allotTokenToClient}>Allote Token</button>
            </div>
          </div>
        </>
      );
    }
  };

  useEffect(() => {
    initprocess();
  }, []);

  const showdata = () => {
    if (client_access_level != undefined) {
      console.log(`client_access-level is not undefined`);
      return (
        <>
          <div>
            <h4>Found Record</h4>
          </div>
          <div>
            <p>
              Client Name = {client_name}
              <br></br>
              Client Access_Level = {client_access_level}
              <br></br>
              Client Balance = {client_balance}
              <br></br>
              Client setted UnlockTime ={client_token_locktime}
            </p>
          </div>
        </>
      );
    }
  };

  const elements = (option) => {
    console.log(`the clientaddress is ${client_access_level}`);
    if (account == undefined) {
      return (
        <>
          <button onClick={walletConnectionHandler}>Connect Wallet</button>
        </>
      );
    }
    if (1) {
      return (
        <>
          <br></br>
          <h1>Wallet connected</h1>
          <br></br>
          <div>
            <p>Enter Client Address</p>
            <input onChange={(e) => searchClient(e.target.value)} />
          </div>
          <br></br>
          <div>
            <button onClick={() => InfoCheck()}>
              Check client Account Details
            </button>
          </div>
        </>
      );
    }
  };
  return (
    <>
      <div>
        <h1>Welcome to Admin client Token Allotment Page</h1>
        <br></br>
        {elements()}
        <br></br>
        {showdata()}
        <br></br>
        {form_fields()}
        <br></br>
        <div className="footer">
          <Link href="/"> Go to Index </Link>
          <Link href="/org/org_admin"> Go to Admin side</Link>
        </div>
      </div>
    </>
  );
}
