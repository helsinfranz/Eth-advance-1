import { useState, useEffect } from "react";
import { ethers } from "ethers";
import vesting_contract_abi from "../artifacts/TokenVesting.json";
import Link from "next/link";
import classes from "../styles/client.module.css";

export default function organization_client_token_allotment_page() {
  const [account, setAccount] = useState(undefined);
  const [ethwallet, setEthallet] = useState(undefined);
  const [info, setInfo] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [smartcontract, setSmartcontract] = useState(undefined);
  const [client_name, setClient_name] = useState(undefined);
  const [search_organizaion_address, setsearch_organizaion_address] =
    useState(undefined);
  const [client_access_level, setClient_access_level] = useState(undefined);
  const [client_balance, setClient_balance] = useState(undefined);
  const [client_token_qty, setClient_token_qty] = useState(undefined);
  const [client_token_locktime, setClient_token_locktime] = useState(undefined);
  const [permission, setPermission] = useState(undefined);

  const contract_ABI = vesting_contract_abi.abi;
  const contract_address = "0x707c950818693F544074f6cf394021ac50a85F77";

  const initprocess = async () => {
    if (window.ethereum) {
      setEthallet(window.ethereum);
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

  const withdrawtoken = async () => {
    smartcontractConnectionHandler();
    if (smartcontract) {
      const time = Math.round(Date.now() / 1000);
      const value1 = await smartcontract._withdraw(
        search_organizaion_address,
        account,
        ethers.BigNumber.from(client_token_qty),
        ethers.BigNumber.from(time)
      );
    }
  };

  const searchClient = async (value) => {
    setsearch_organizaion_address(value);
  };

  const readInputs = async (text, option) => {
    if (option == "1") {
      setClient_token_qty(text);
    }
    setInfo("Please Recheck your Entered information.");
  };

  const InfoCheck = async () => {
    smartcontractConnectionHandler();

    if (smartcontract) {
      //let id = await smartcontract._get_my_id(search_organizaion_address);
      let id = await smartcontract._get_my_id(
        search_organizaion_address,
        account
      );
      console.log(
        `the value of ${account} dflkjfdkl${search_organizaion_address}`
      );
      const [access_level, clientName, balance, unlock] =
        await smartcontract._show_client_info(
          search_organizaion_address,
          account,
          ethers.BigNumber.from(id)
        );
      const abletowhith = await smartcontract.get_client_whitelisting_state(
        search_organizaion_address,
        account
      );
      if (access_level) {
        setClient_access_level(parseInt(access_level._hex, 16).toString());
        setClient_name(clientName);
        setClient_balance(parseInt(balance._hex, 16).toString());
        setClient_token_locktime(parseInt(unlock._hex, 16).toString());
        setPermission(abletowhith);
        console.log(`the value of ${abletowhith}`);
      }
    }
  };

  const form_fields = () => {
    if (permission == "True") {
      return (
        <>
          <div>
            <p>Enter Your Client Token Quantity </p>
            <div className="footer">
              <input onChange={(e) => readInputs(e.target.value, 1)} />
              <button onClick={withdrawtoken}>withdrawtoken Token</button>
            </div>
          </div>
        </>
      );
    }
    if (permission == "False") {
      return <h3>Sorry your are not Authorised to withdraw Tokens</h3>;
    }
  };

  useEffect(() => {
    initprocess();
  }, []);

  const showdata = () => {
    if (client_access_level != undefined) {
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

  const elements = () => {
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
            <p>Enter Oraganization Account Address</p>
            <input onChange={(e) => searchClient(e.target.value)} />
          </div>
          <div>
            <button onClick={() => InfoCheck()}>Check Details</button>
          </div>
        </>
      );
    }
  };
  return (
    <>
      <div>
        <h1>Welcome to client Interaction Page</h1>
        {elements()}
        <br></br>
        {showdata()}
        <br></br>
        {form_fields()}
        <br></br>
        <div className={classes.footer}>
          <Link href="/"> Go to Index </Link>
          <Link href="/org/org_admin"> Go to Admin side</Link>
        </div>
      </div>
    </>
  );
}
