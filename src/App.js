import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ai from "./ai.png";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>
      <div>
        <h1 className="Logo">DECENTRALISED BLOCKCHAIN STORAGE SYSTEM</h1>
        {!modalOpen && (
          <button className="btn" onClick={() => setModalOpen(true)}>
            Share
          </button>
        )}
        {modalOpen && (
          <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
        )}
        <div className="container">
          <div className="App_cont row align-items-start">
            <div className="col">
              <p style={{ color: "orange" }}>
                Account : {account ? account : "Not connected"}
              </p>
              <h1 className="gradient__text">
                Let&apos;s Secure Your Data With DBSS
              </h1>
              <p className="para">
                Store your data with no third party involved and share your
                files with your friends in a most secure way.
              </p>
              <FileUpload
                account={account}
                provider={provider}
                contract={contract}
              ></FileUpload>
            </div>
            <div className="col img_col">
              <img className="ai_img" src={ai} alt="..." />
            </div>
          </div>
          <Display contract={contract} account={account}></Display>
        </div>
      </div>
    </>
  );
}

export default App;
