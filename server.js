const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const local_DB = {};
const local_DB_Doutor = {};
const local_DB_Receipt = {};
const cors = require('cors');
//const local_DB_Combined = {};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({credentials: true, origin: true}))

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/getAccounts', (req, res) => {
  console.log("**** GET /getAccounts ****");
  truffle_connect.start(function (answer) {
    res.send(answer);
  })
});

// app.post('/getBalance', (req, res) => {
//   console.log("**** GET /getBalance ****");
//   console.log(req.body);
//   let currentAcount = req.body.account;

//   truffle_connect.refreshBalance(currentAcount, (answer) => {
//     let account_balance = answer;
//     truffle_connect.start(function(answer){
//       // get list of all accounts and send it along with the response
//       let all_accounts = answer;
//       response = [account_balance, all_accounts]
//       res.send(response);
//     });
//   });
// });

app.post('/getData', (req, res) => {
  console.log("**** POST /getData ****");
  //console.log(req.body);
  let currentAcount = req.body.account;

  truffle_connect.getData(currentAcount, (answer) => {
    res.send(answer);
  });
});

app.post('/setData', (req, res) => {
  console.log("**** POST /setData ****");
  //console.log(req.body);
  let currentAcount = req.body.account;
  let prescription = JSON.stringify(req.body.prescription);
  let hash = crypto.createHash('md5').update(prescription).digest('hex');
  local_DB[hash] = prescription;
  console.log(local_DB)

  truffle_connect.setData(currentAcount, hash, (answer) => {
    if (answer)
      res.send(hash);
    else
      res.send(false);
  });
});

app.post('/getPrescription', (req, res) => {
  console.log("**** POST /getPrescription ****");
  let hash = req.body.hash;

  if (hash in local_DB)
    res.send(JSON.parse(local_DB[hash]));
  else
    res.send(false)
});


app.post('/setDoutor', (req, res) => {
  console.log("**** POST /setDoutor ****");
  let currentAcount = req.body.name;
  let prescription = req.body.code;
  let hash = crypto.createHash('md5').update(prescription).digest('hex');
  local_DB_Doutor[hash] = prescription;
  console.log(local_DB_Doutor)  

  truffle_connect.setData(currentAcount, hash, (answer) => {
    if (answer)
      res.send(hash);
    else
      res.send(false);
  });
});

app.post('/getDoutor', (req, res) => {
  console.log("**** POST /getDoutor ****");
  let hash = req.body.hash;

  if (hash in local_DB_Doutor)
    res.send(JSON.parse(local_DB_Doutor[hash]));
  else
    res.send(false)
});

app.post('/setComb', (req, res) => {
  console.log("**** POST /setComb ****");
  //let currentAcount = req.body.name;
  let prescription = req.body.code;
  let hash = crypto.createHash('md5').update(prescription).digest('hex');
  local_DB[hash] = prescription


  truffle_connect.setData(prescription, hash, (answer) => {
    if (answer)
      res.send(hash);
    else
      res.send(false);
  });
});

app.post('/getComb', (req, res) => {
  console.log("**** POST /getComb ****");
  let hash = req.body.hash;

  if (hash in local_DB)
    res.send(JSON.parse(local_DB[hash]));
  else
    res.send(false)
});

app.post('/getDecod', (req, res) => {
  console.log("**** POST /getDecod ****");
  //console.log(req.body);
  let hash = JSON.stringify(req.body.hash);
  var pos = hash.search(",");
  let hash1 = hash.substring(pos-34,pos-2);
  //console.log(hash1);
  var pos = hash.search("}");
  let hash2 = hash.substring(pos-34,pos-2);
  //console.log(hash2);

  if (hash1 in local_DB_Doutor)
    res.send(JSON.parse(local_DB_Doutor[hash1]));
  else
    res.send(false)

  if (hash2 in local_DB)
    res.send(JSON.parse(local_DB[hash2]));
  else
    res.send(false)
});

app.post('/setReceipt', (req, res) => {
  console.log("**** POST /setComb ****");
  //let currentAcount = req.body.name;
  let prescription = req.body.code;
  let hash = crypto.createHash('md5').update(prescription).digest('hex');
  local_DB_Receipt[hash] = prescription
  console.log(local_DB_Receipt);

  truffle_connect.setData(prescription, hash, (answer) => {
    if (answer)
      res.send(hash);
    else
      res.send(false);
  });
});

app.post('/getReceipt', (req, res) => {
  console.log("**** POST /getReceipt ****");
  let hashi = req.body.hash;
  console.log(hashi);

  content = [];
  if (hashi in local_DB_Receipt)
    content.push(JSON.parse(local_DB_Receipt[hashi]));
  console.log(content);
  let retorno = [];
  for(receipt in content[0]){
    if(content[0][receipt] in local_DB){
      retorno.push(local_DB[content[0][receipt]])
    }
  }
  if(retorno.length){
    res.send(retorno)
  }else{
    res.send(false)
  }

});

app.post('/getReceipts', (req, res) => {
  console.log("**** POST /getReceipts ****");
  console.log(req.body);
  let hash = JSON.stringify(req.body.hash);
  var pos = hash.search(",");
  let hash1 = hash.substring(pos-34,pos-2);
  console.log(hash1);
  var pos = hash.search("}");
  let hash2 = hash.substring(pos-34,pos-2);
  console.log(hash2);

  var tmp = []

  if (hash1 in local_DB)
    //res.send(JSON.parse(local_DB[hash1]));
    tmp.push(JSON.parse(local_DB[hash1]));

  if (hash2 in local_DB){
    tmp.push(JSON.parse(local_DB[hash2]));
    res.send( tmp );
  }
  else
    res.send(false)
});

// app.post('/sendCoin', (req, res) => {
//   console.log("**** GET /sendCoin ****");

//   let amount = req.body.amount;
//   let sender = req.body.sender;
//   let receiver = req.body.receiver;

//   truffle_connect.sendCoin(amount, sender, receiver, (balance) => {
//     res.send(balance);
//   });
// });


app.listen(port, () => {

  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

  console.log("Express Listening at http://localhost:" + port);

});
