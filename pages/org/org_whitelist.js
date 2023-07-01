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
  const [client_token_locktime, setClient_token_locktime] = useState(undefined);
  const [client_whitelist_state, setClient_whitelist_state] =
    useState(undefined);
  const [input, setinput] = useState(undefined);

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

      const value1 = await smartcontract.whitelistingManagement(
        account,
        search_client_address,
        input
      );
    }
  };

  const searchClient = async (value) => {
    setSearch_client_address(value);
  };

  const readInputs = async (text, option) => {
    if (option == "1") {
      if (text == "1") {
        setinput("True");
      }
      if (text == "0") {
        setinput("False");
      }
    }
    setInfo("Please Re_check your Entered information.");
  };

  const InfoCheck = async () => {
    smartcontractConnectionHandler();

    if (smartcontract) {
      let id = await smartcontract._get_my_id(account, search_client_address);

      const [access_level, clientName, balance, unlock] =
        await smartcontract._show_client_info(
          account,
          search_client_address,
          ethers.BigNumber.from(id)
        );

      setClient_whitelist_state(
        await smartcontract.get_client_whitelisting_state(
          account,
          search_client_address
        )
      );

      if (access_level) {
        setClient_access_level(parseInt(access_level._hex, 16).toString());
        setClient_name(clientName);
        setClient_balance(parseInt(balance._hex, 16).toString());
        setClient_token_locktime(parseInt(unlock._hex, 16).toString());
      }
    }
  };

  const form_fields = () => {
    if (client_access_level != undefined) {
      return (
        <>
          <div>
            <p>Enter Client whitelisting State</p>
            <p>Enter 1 for True and Enter 0 for False</p>
            <div className="footer">
              <input onChange={(e) => readInputs(e.target.value, 1)} />
              <button onClick={allotTokenToClient}>Set State</button>
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
              Client setted UnlockTime = {client_token_locktime}
            </p>
            <p>Client client whitelist state = {client_whitelist_state}</p>
          </div>
        </>
      );
    }
  };

  const elements = (option) => {
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
        <h1>Welcome to Admin client Whitelisting Page</h1>
        {elements()}
        <br></br>
        {showdata()}
        <br></br>
        {form_fields()}
        <br></br>
        <div className="footer">
          <Link href="/"> Go to Index </Link>
          <br></br>
          <Link href="/org/org_admin"> Go to Admin side</Link>
          <br></br>
        </div>
      </div>
    </>
  );
}
