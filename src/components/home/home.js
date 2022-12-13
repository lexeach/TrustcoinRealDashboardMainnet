import React, { useEffect, useState } from "react";
import abiDecoder from "abi-decoder";
import Web3 from "web3";
import { ICU, BEP20, USDT } from "../../utils/web3.js";

const Dashboard = () => {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [frznBalance, setFrznBalance] = useState();
  const [registration_Free, setRegistrationFee] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [current_id, setCurrentId] = useState();
  const [current_tokenAccepting, setCurrentTokenAccepting] = useState();
  const [tokenRewarded, setTokenRewarded] = useState();
  const [payAutoPool, setPayAutoPool] = useState();
  const [levelPrice, setLevelPrice] = useState();

  const [referrerID, setReferrerID] = useState({ id: "" });
  const [tokenReword, setTokenReword] = useState({ amount: "" });
  const [regFess, setRegFess] = useState({ amount: "" });
  const [tkAcc, settkAcc] = useState(null);

  // set it latter
  const [tokenPrice, setTokenPrice] = useState();
  const [nextReward, setNetxtReward] = useState();

  useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      console.log("accounts00000NNNN", accounts);
      if (!accounts) {
        alert("please install metamask");
      }
      let balance = await web3.eth.getBalance(accounts[0]);
      const etherValue = web3.utils.fromWei(balance, "ether");
      setBalance(etherValue);
      setAccount(accounts[0]);
      let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
      let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
      let frozenBalance = await BEP20_.methods
        ._frozenBalance(accounts[0])
        .call();
      let RegistrationFee = await ICU_.methods.getRegistrationFess().call();
      let currentId = await ICU_.methods.currUserID().call();
      let currentTokenAccepting = await ICU_.methods
        .currentTokenAccepting()
        .call();
      let token_rewared = await ICU_.methods.tokenReward().call();
      let pay_auto_pool = await ICU_.methods.Autopool_Level_Income().call();
      let level_income = await ICU_.methods.level_income().call();
      let tokenPriceIs = await ICU_.methods.tokenPrice().call();
      let getNextReward = await ICU_.methods.getNextReward().call();
      console.log("level income", level_income, getNextReward, tokenPriceIs);

      // const etherValue = Web3.utils.fromWei('1000000000000000000', 'ether');

      const convert_pay_auto_pool = web3.utils.fromWei(pay_auto_pool, "ether");

      const frozenBalance_convert = web3.utils.fromWei(frozenBalance, "ether");
      setFrznBalance(roundToFour(frozenBalance_convert));

      const convert_regfee = web3.utils.fromWei(RegistrationFee, "ether");
      setRegistrationFee(convert_regfee);

      setCurrentId(currentId);
      setCurrentTokenAccepting(currentTokenAccepting);

      const token_rewared_convert = web3.utils.fromWei(token_rewared, "ether");
      setTokenRewarded(roundToFour(token_rewared_convert));
      setPayAutoPool(roundToFour(convert_pay_auto_pool));

      const convert_levelincome = web3.utils.fromWei(level_income, "ether");
      setLevelPrice(roundToFour(convert_levelincome));

      // token balance
      let token_balance = await BEP20_.methods.balanceOf(accounts[0]).call();

      const convert_tokenBal = web3.utils.fromWei(token_balance, "ether");
      setTokenBalance(roundToFour(convert_tokenBal));

      // Set Token PRice and Next Level Reward
      const tokenPriceIs_convert = web3.utils.fromWei(tokenPriceIs, "ether");
      const getNextReward_convert = web3.utils.fromWei(getNextReward, "ether");

      setTokenPrice(tokenPriceIs_convert);
      setNetxtReward(roundToFour(getNextReward_convert));
    }

    function roundToFour(num) {
      return +(Math.round(num + "e+4") + "e-4");
    }
    load();
  }, []);

  const handleChange = (event) => {
    let { name, value } = event.target;
    setReferrerID({ ...referrerID, [name]: value });
  };

  const handleChangeTkReword = (event) => {
    let { name, value } = event.target;
    setTokenReword({ ...tokenReword, [name]: value });
  };

  const handleChangeRegFess = (event) => {
    let { name, value } = event.target;
    setRegFess({ ...regFess, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("the referrerID", referrerID);

    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let value_ = await ICU_.methods.REGESTRATION_FESS().call();
    let currentTokenAccepting = await ICU_.methods
      .currentTokenAccepting()
      .call();
    console.log("the approve currentTokenAccepting", currentTokenAccepting);
    // the approve currentTokenAccepting ERC20-Token-Accepting

    if (currentTokenAccepting === "Native-Coin-Accepting") {
      let USDT_ = new web3.eth.Contract(USDT.ABI, USDT.address);
      let isAllowance = await USDT_.methods
        .allowance(account, ICU.address)
        .call();
      let isApprove, reg_user;
      if (isAllowance < value_) {
        isApprove = await USDT_.methods
          .approve(ICU.address, value_)
          .send({ from: account });
      } else {
      }
      reg_user = await ICU_.methods
        .Registration(referrerID.id, value_)
        .send({ from: account, value: 0 });
      console.log("****** native coin accepting condtion", reg_user);
      if (reg_user.status) {
        alert("Registerd Success");
      } else {
        alert("Registerd Failed !!!!");
      }
    } else {
      let BEP20_ = new web3.eth.Contract(BEP20.ABI, BEP20.address);
      let approve = await BEP20_.methods
        .approve(ICU.address, value_)
        .send({ from: account });
      console.log("the approve response", approve);
      console.log("the value out of status", value_);
      if (approve.status === true) {
        let reg_user = await ICU_.methods
          .regUser(referrerID.id, value_)
          .send({ from: account, value: 0 });
        if (reg_user.status) {
          alert("Registerd Success");
        } else {
          alert("Registerd Failed !!!!");
        }
      }
    }
  };

  const handleSubmitTKRword = async (event) => {
    event.preventDefault();

    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let tkrword = await ICU_.methods
      .changeTokenReward(tokenReword.amount)
      .send({ from: account });
    if (tkrword.status) {
      alert("Reworded");
    } else {
      alert("Failed");
    }
  };

  const handleSubmitRegFee = async (event) => {
    event.preventDefault();

    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let regfess = await ICU_.methods
      .setRegistrationFess(regFess.amount)
      .send({ from: account });
    if (regfess.status) {
      alert("Reworded");
    } else {
      alert("Failed");
    }
  };

  const handleSubmitAcceptance = async (event) => {
    event.preventDefault();
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    let tkAccept = await ICU_.methods
      .setTokenAcceptance(tkAcc.value)
      .send({ from: account });
    if (tkAccept.status) {
      alert("Token Acceptance");
    } else {
      alert("Failed");
    }
  };

  const tokenAcceptanceOption = [
    { value: "true", label: "True" },
    { value: "false", label: "False" },
  ];

  useEffect(() => {
    contractCall();
  }, []);

  async function contractCall() {
    let ICU_ = new web3.eth.Contract(ICU.ABI, ICU.address);
    ICU_.getPastEvents(
      "LevelsIncome",
      {
        fromBlock: 24894404,
        toBlock: 24896404,
      },
      function (error, events) {
        if (error) {
          console.log("Errror ", error);
        } else console.log("EventIs", events);
      }
    ).then(function (events) {
      console.log("Is ******", events[0]);

      let param_values = [];

      for (let i = 0; i < 2; i++) {
        console.log("start time out function", i);

        // setTimeout(() => {
        console.log("inside time out function");
        let transaction = events[i].transactionHash;
        console.log("transaction ******", transaction);
        web3.eth.getTransaction(transaction, function (err, tx) {
          abiDecoder.addABI(ICU.ABI);
          let tx_data = tx.input;

          let decoded_data = abiDecoder.decodeMethod(tx_data);
          let params = decoded_data.params;
          // desin pattern
          for (let j in params) {
            // loop to print parameters without unnecessary info
            console.log("params inside nested loop", j, "params", params);
            param_values.push(params);
          }
          console.log("params in loop", param_values);
          //   },
          //   3000
          // );
        }); // same results as the optional callback above
      }

      console.log("params", param_values);
    });
  }

  return (
    <div className="home-container">
      <div className="row">
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Frozen Balance </h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h4 className="mb-0">
                      {frznBalance ? frznBalance : 0} (TRCT)
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Token Balance</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h4 className="mb-0">
                      {tokenBalance ? tokenBalance : 0} (TRCT)
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>BNB Balance</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h4 className="mb-0">{balance ? balance : 0}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* reg fee  */}
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Registration Fee</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h4 className="mb-0">
                      {registration_Free ? registration_Free : 0} (USDT)
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Current ID</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h4 className="mb-0">{current_id ? current_id : 0}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Direct Income</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h4 className="mb-0" style={{ fontSize: "15px" }}>
                      {current_tokenAccepting ? registration_Free / 5 : 0}{" "}
                      (USDT)
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Token reward</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h4 className="mb-0">
                      {tokenRewarded ? tokenRewarded : 0} (TRCT)
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Token Price</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h4 className="mb-0">
                      {tokenPrice ? tokenPrice : 0} (USDT)
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Next Reward</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h4 className="mb-0">
                      {nextReward ? nextReward : 0} (TRCT)
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body text-center">TRCT address 0x2eD68EF708f0a04eaeb705D1A5700F72E9a6054C</div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Autopool Income</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h2 className="mb-0">
                      {payAutoPool ? payAutoPool : 0} (USDT)
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Level Income</h5>
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h2 className="mb-0">
                      {levelPrice ? levelPrice : 0} (USDT)
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h5>Sponsor ID</h5>
              <div className="row">
                <div className="col-sm-12 my-auto">
                  <form className="forms-sample" onSubmit={handleSubmit}>
                    <div className="form-group w-100">
                      <input
                        className="form-control mt-2"
                        type="number"
                        required
                        name="id"
                        onChange={handleChange}
                        value={referrerID.id}
                        placeholder="Referral ID"
                      />
                      <input
                        className="btn btn-primary mt-3"
                        type="submit"
                        value="Submit"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
