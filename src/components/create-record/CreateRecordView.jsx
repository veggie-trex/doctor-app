import React from 'react';
import DatePicker from "react-datepicker";
import axios from 'axios';

import "react-datepicker/dist/react-datepicker.css";
import "./CreateRecordView.css"

elw = require('eth-lightwallet');
EthCrypto = require('eth-crypto');
EthereumTx = require('ethereumjs-tx');

class CreateRecordView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      type: '',
      doctor: '',
      date: new Date(),
      nextDate: new Date(),
      pwDerivedKey: '',
      keystore: '',
      address: '',
      PrivateKey: '',
      recpientPublicKey: ''
    };
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeNextDate = this.handleChangeNextDate.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeDoctor = this.handleChangeDoctor.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeDoctor(event) {
    this.setState({
      doctor: event.target.value
    });
  }

  handleChangeName(event) {
    this.setState({
      name: event.target.value
    });
  }

  handleChangeType(event) {
    this.setState({
      type: event.target.value
    });
  }

  handleChangeDate(date) {
    this.setState({
      date: date
    });
  }

  handleChangeNextDate(date) {
    this.setState({
      nextDate: date
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    axios.post('localhost:8080/createRecord', this.state).then(response => console.log(response));

    // 1. Encode Record
    encodedRecord = this.encodeRecord();

    // 2. Extract Wallet Variables
    await this.extractWalletVars();
    
    // 3. Sign Record
    let rawSignedRecord = this.signRecord(encodedRecord) // rawSignedRecord: {r: Buffer, s: Buffer, v: int}

    // 4. Format signed record -- convert the Buffer Object into a Stringify'd JSON
    let signedRecord = this.formatRawSignedRecord(rawSignedRecord);

    // 5. Encrypt the Record in the name of the user's Public Key
    let encryptedSignedRecord = await this.encryptSignedRecord(signedRecord)

    // 6. Send Encrypted Signed Record AND Sender Address AND Recipient Address to API
    const txnParams = await this.getTxnParams(encryptedSignedRecord, this.address, EthCrypto.publicKey.toAddress(this.recepientPublicKey));

    // 7. Get 
    const serializedTx = this.getSerializedTransaction(txnParams);

    // 8. 
    const txnHash = await this.sendSerializedTxn(serializedTx);

    // 9.
    const validity = await this.validateTxnHash(txnHash);

    return validity;
  }

  async encodeRecord() {
    const form = {
      'a':1,
      'b':2,
    }
    return btoa(JSON.stringify(form));
  }

  async extractWalletVars() {
    const mnemonic = ''; //Read mnemonic

    // Assert Mnemonic is valid.
    if(!elw.keystore.isSeedValid(mnemonic)){
      console.log('Show an error on the mnemonic form. The mnemonic is invalid.');
      return false;
    }
    this.setKeystoreVariables();
  }

  setKeystoreVariables() {
    const mnemonic = ''; // Read mnemonic
    const password = '' || ''; // Read password or set it to none

    options = {
      password: password,
      seedPhrase: mnemonic,
      hdPathString: "m/44'/60'/0'/0"
    }

    var keystore;
    var pwDerivedKey
    elw.keystore.createVault(options, 
      (err, ks) => {
        if (err) throw err;
        keystore = ks;
        keystore.keyFromPassword(password, (err, _pwDerivedKey) => {
          pwDerivedKey = _pwDerivedKey;
          keystore.generateNewAddress(pwDerivedKey, 1);
          var address = keystore.getAddresses()[0];
          privateKey = keystore.exportPrivateKey(address, pwDerivedKey)
          this.setState({
            keystore,
            pwDerivedKey,
            address
          })
        })
      });
  }

  signRecord(encodedRecord) {
    return elw.signing.signMsg(this.keystore, this.pwDerivedKey, encodedRecord, this.address)
  }

  formatRawSignedRecord(signature) {
    return JSON.stringify({
      r: signature.r.toString('hex'),
      s: signature.s.toString('hex'),
      v: signature.v
    })
  }

  encryptSignedRecord(record) {
    // Notice this is asking for the public_key, not the address. 
    await EthCrypto.encryptWithPublicKey(this.recpientPublicKey, record);
  }

  async getTxnParams(record, senderAddress, recipientAddress) { 
    console.log('fill me in with an HTTP request to the Lambda');
  }

  async getSerializedTransaction(txnParams) {
    let tx = new EthereumTx(txnParams);
    tx.sign(this.privateKey);
    return tx;
  }

  async sendSerializedTxn(serializedTxn) {
    console.log('hit the 2nd lambda');
  }

  async validateTxnHash(txnHash) {
    console.log('hit the 3rd lambda');
    return true;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Create Immunization record</h1>
        <div className='form-group'>
          <label>
            Name:
            <input className='form-control' type="text" value={this.state.value} onChange={this.handleChangeName} />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Date:
          <div className="form-control">
              <DatePicker
                selected={this.state.date}
                onChange={this.handleChangeDate}
              />
            </div>
          </label>
        </div>
        <div className='form-group'>
          <label>
            Next immunization date:
          <div className="form-control">
              <DatePicker
                selected={this.state.nextDate}
                onChange={this.handleChangeNextDate}
              />
            </div>
          </label>
        </div>
        <div className='form-group'>
          <label>
            Type:
            <input className='form-control' type="text" value={this.state.value} onChange={this.handleChangeType} />
          </label>
          <div className='form-group'>
          </div>
          <label>
            administered by:
            <input className='form-control' type="text" value={this.state.doctor} onChange={this.handleChangeDoctor} />
          </label>
        </div>
        <div>
          <button className='btn btn-primary' type="submit" value="Submit">Submit</button>
        </div>
      </form>
    );
  }
}

export default CreateRecordView;