import logo from './logo.svg';
import './App.css';
import React, {useState, useEffec, useEffect} from 'react';
import Web3 from 'web3';
import LotteryABI from "./contracts/Lottery.json";
const lotteryABI = LotteryABI.abi;
const lotteryAddress = "0xC89C4883D9206f011cC10AeB06558845BCe8Ddfd";

function App() {

  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [lotteryContract, setLotteryContract] = useState();

  const initWeb3 = async () => {
    let tempWeb3;
    console.log(window.ethereum)
    if (window.ethereum) {
      tempWeb3 = new Web3(window.ethereum);
      try {
        // await window.ethereum.enable();
        const tempAccounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        setAccounts(tempAccounts);
        console.log(tempAccounts)
      } catch (error) {
        console.log(`User denied account access error : ${error}`);
      }
    } else if (window.web3) {
      tempWeb3 = new Web3(Web3.currentProvider);
    } else {
      console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }

    if (tempWeb3) {
      setWeb3(tempWeb3);

      
      const tempLotteryContract = new tempWeb3.eth.Contract(lotteryABI, lotteryAddress)
      // tempLotteryContract.getPastEvents("BET", {
      //   fromBlock: 0,
      //   toBlock: "lastest"
      // })
      setLotteryContract(tempLotteryContract);
    }
  }

  useEffect(() => {
    initWeb3();
  }, []);

  const getBetEvent = async () => {
    const records = [];

    const events = await lotteryContract.getPastEvents(
      'BET', 
      {
        fromBlock: 0,
        toBlock: "latest",
      }
    );
    console.log(events);
  }

  const bet = async () => {
    web3.eth.getTransactionCount(accounts[0])
      .then(nonce => {
        return lotteryContract.methods
          .betAndDistribute("0xcd")
          .send({
            from:accounts[0], 
            value: web3.utils.toWei("0.005", "ether"), 
            gas: 300000,
            nonce
          })
      }).then(result => {
        console.log(result);
      }).catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    // const balance = web3.eth.getBalance(accounts[0]);
    if (!web3) return;
    web3.eth.getBalance(accounts[0])
      .then(rawBalance => {
        // console.log(balance);
        const balance = web3.utils.fromWei(rawBalance,"ether");
        console.log(balance);
      }).catch(err => {
        console.log(err);
      });
  }, [accounts])
  return (
    <div className="App">
      <button onClick={() => {
        web3.eth.getAccounts()
          .then(result => {
            console.log(result);
          }).catch(err => {
            console.log(err);
          })
      }}>버튼</button>
      <button
        onClick={async () => {
          // call은 request만, tx는 invoke, send등으로
          const pot = await lotteryContract.methods.getPot().call();
          const owner = await lotteryContract.methods.owner().call();
          console.log(pot, owner);
        }}
      >팟머니 확인</button>

      <button
        onClick={bet}
      >
        BetAndDistribute
      </button>
      <button
        onClick={() => {
          getBetEvent();
        }}
      >
        getPastEvents
      </button>
    </div>
  );
}

export default App;
