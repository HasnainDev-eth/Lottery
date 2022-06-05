import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import logo1 from "./logo1.svg"
import { ethers } from "ethers";
import abi from "./abi.json"
import token_abi from "./token.json"

function App() {

  const [join_count, setjoin_count] = useState(1)
  const [totaldraw, settotaldraw] = useState(0);
  const [btnloadicon, setbtnloadicon] = useState("none");
  const [_count, set_count] = useState(0)
  const toEther = wei => (ethers.utils.formatEther(wei).toString());
  const toWei = ether => (ethers.utils.parseEther(ether));
  const [btntext, setbtntet] = useState("Connect Wallet")
  const [provider, setprovider] = useState(undefined);
  const [signer, setsigner] = useState(undefined);
  const [Entries, setEntries] = useState(0)
  const [Conract, setContract] = useState(undefined)
  const [Cost, setCost] = useState(0)
  const [token, settoken] = useState(undefined)
  const decimals = 18;
  const _input = "10000";

  const _amount = ethers.utils.parseUnits(_input, decimals);
  //   Incrementing   and Decrementing
  const Incrementing = () => {
    if (join_count >= 5 - Math.trunc(_count)) {
      setjoin_count(5 - Math.trunc(_count));
    } else {
      setjoin_count(join_count + 1);
    }
  };

  const Decrementing = () => {
    if (join_count <= 1) {
      setjoin_count(5 - Math.trunc(_count));
    } else {
      setjoin_count(join_count - 1);
    }
  };
  const requestAccounts = async () => {
    try {
      setbtntet("initializing");
      if (window.ethereum && window.ethereum.isMetaMask) {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);

        const _signer = _provider.getSigner();
        setprovider(_provider);
        setsigner(_signer);

        await _provider.send("eth_requestAccounts", []);

        const network = await _provider.getNetwork();
        const chainId = network.chainId;
        if (chainId != 97) {
          setbtntet("WRONG NETWORK");


        } else {
          setbtntet("Enter Draw")
          const _Contract = new ethers.Contract("0x045dA6F7F9e1A96Fe3e349f17a4343e8E4872302", abi, _signer);
          //   const _token = new ethers.Contract("0xF54dB4adc2267654Cad98228e0194a40573e2430", token_abi, _signer);
          const TotalEntries = await _Contract.TotalEntries();
          const lotteryId = await _Contract.lotteryId();

          let _lotteryId = ethers.utils.formatEther(toWei(lotteryId.toString()))
          setEntries(TotalEntries)




          const EntryCount = await _Contract.EntryCount(Math.trunc(_lotteryId), _signer.getAddress())


          set_count(ethers.utils.formatEther(toWei(EntryCount.toString())))
          setContract(_Contract)
          // settoken(_token)



        }
      } else {

        setbtntet("INSTALL METAMASK");
      }
    } catch (error) {

      console.log(error)
    }
  }
  const getdata = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
     // "https://rinkeby.infura.io/v3/3be7cd4089a94b29a4756a6e279a0de4"
     "https://data-seed-prebsc-1-s1.binance.org:8545/"

    );

    const contract = new ethers.Contract(
      "0x045dA6F7F9e1A96Fe3e349f17a4343e8E4872302",
      abi,
      provider
    );
    const _TotalEntries = await contract.TotalEntries();
    const lotteryId = await contract.lotteryId();

    const cost = await contract.cost();

    settotaldraw(ethers.utils.formatEther(toWei(lotteryId.toString())))
    setEntries(ethers.utils.formatEther(toWei(_TotalEntries.toString())))
    setCost((toEther(cost.toString())))


  }
  const btn = () => {
    try {
      setbtnloadicon("");
      if (btntext === "Connect Wallet") {
        requestAccounts();
      } if (btntext == "Enter Draw") {
        EnterDraw();
      }
    } catch (err) {
      console.log(err)
      setbtnloadicon("none");
    }

  }
  const getcount = async () => {
    const EntryCount = await Conract.EntryCount(Math.trunc(totaldraw), signer.getAddress())


    set_count(ethers.utils.formatEther(toWei(EntryCount.toString())))

  }

  const EnterDraw = async () => {
    if (join_count != 0 && Math.trunc(Entries) != 10) {
      try {
        setbtntet("Joining")
        const decimals = 18;
        const _input = "10000";


        const _amount = ethers.utils.parseUnits(_input, decimals);
        const _token = new ethers.Contract("0xb9Dff3a56AAFE12368A9EceD6A71940693498be6", token_abi, signer);
        const _Contract = new ethers.Contract("0x045dA6F7F9e1A96Fe3e349f17a4343e8E4872302", abi, signer);



        const _approve = await _token.approve("0x045dA6F7F9e1A96Fe3e349f17a4343e8E4872302", _amount);

        await _approve.wait();

        const Enter = await _Contract.Enter(join_count.toString());
        await Enter.wait();
        getcount()
        getdata()
        setbtntet("Enter Draw")

      } catch (err) {
        console.log(err)
        setbtntet("Enter Draw")
      }





    }




  }
  useEffect(() => {
    getdata();
  }, []);

  return (


    <>
      <div className="App">
        <h1 className='upper-text'>
          BSC LOTTERY SYSTEM
        </h1>
        <div className="botton">
          <div className="button-box">
            <button>
              ENTER DRAW
            </button>
            <button>
              LERAN MORE
            </button>
            <button>
              PASTE WINNERS
            </button>
          </div>


        </div>
        <div className="content-join">
          <h3>

            Draw Count: {Math.trunc(totaldraw)}
          </h3>
          <h3>
            Current Entries
            {Math.trunc(Entries)}/10
          </h3>
          <h3>
            Your   Entries Left: {""}
            {Math.trunc(_count) + "/" + 5}
          </h3>
          <div className="mint-count">
            <button className="count" onClick={Decrementing}>
              -
            </button>

            <div>
              <h1 className="nums">{join_count} Join</h1>
            </div>
            <button className="count" onClick={Incrementing}>
              +
            </button>





          </div>
          <div className="enter">
            <h1>
              Cost {Cost * join_count} {""}
              BabyQuint
            </h1>
            <button className='ENTER' onClick={btn}>

              {btntext}
            </button>
          </div>


        </div>
        <div className="icons">
          <a href="#"> <li class="fab fa-twitter" style={{ color: "#59b4aa" }}></li></a>
          <a href="#"> <li class="fab fa-discord" style={{ color: "#59b4aa" }}></li></a>
          <a href="
          ">
            <img src={logo1} alt="" className='logo1' />
          </a>




        </div>
      </div>
    </>

  );
}
export default App;
