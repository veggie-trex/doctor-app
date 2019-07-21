import React from 'react';
import DatePicker from "react-datepicker";
import axios from 'axios';

import "react-datepicker/dist/react-datepicker.css";
import "./CreateRecordView.css"

import lightwallet  from 'eth-lightwallet'
import EthCrypto from 'eth-crypto';
const EthereumTx = require('ethereumjs-tx');

class CreateRecordView extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      // Below is form data:
      immunizationType: '',
      typeOfVaccine: '',
      immunizationDate: '',
      fundingSource: '',
      routeAndSide: '',
      vaccineLot: '',
      vaccineMfr: '',
      dateOnVIS: '',
      doctorId: '',
      mnemonic: '',
      password: '',
      recipientPublicKey: '',

      // Below is blockchain data:
      pwDerivedKey: '',
      keystore: '',
      address: '',
      privateKey: '',
    };
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  handleChangeDate(date) {
    this.setState({
      immunizationDate: date
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    if(!this.state.recipientPublicKey || !this.state.mnemonic) {
      return;
    }

    // 1. Encode Record
    let encodedRecord = this.encodeRecord();

    // 2. Extract Wallet Variables
    let varsExtracted = await this.extractWalletVars();
    if (!varsExtracted) {
      return;
    }
    
    // 3. Sign Record3
    let rawSignedRecord = this.signRecord(encodedRecord) // rawSignedRecord: {r: Buffer, s: Buffer, v: int}

    // 4. Format signed record -- convert the Buffer Object into a Stringify'd JSON
    let signedRecord = this.formatRawSignedRecord(rawSignedRecord);

    // 5. Encrypt the Record in the name of the recipient's Public Key
    let encryptedSignedRecord = await this.encryptSignedRecord(signedRecord)

    // 6. Send Encrypted Signed Record AND Sender Address AND Recipient Address to API
    const txnParams = await this.getTxnParams(btoa(JSON.stringify(encryptedSignedRecord)), 
      this.state.address, EthCrypto.publicKey.toAddress(this.state.recipientPublicKey));

    // 7. Get 
    const serializedTx = this.getSerializedTransaction(txnParams);

    // 8. 
    console.log('txnParams: ', txnParams);
    console.log('privateKey:', this.state.privateKey);
    console.log('address:', this.state.address);
    console.log('password:', this.state.password);
    console.log('recipientPublicKey:', this.state.recipientPublicKey);
    console.log('serializedTx:', serializedTx);
    const sendTransactionResponse = await this.sendSerializedTxn(serializedTx);
    
    const txnHash = sendTransactionResponse && sendTransactionResponse.data && sendTransactionResponse.data.transactionHash;
    // 9.
    const validityResponse = await this.validateTxnHash(txnHash);
    var validity;
    if(validityResponse.status===200) {
      validity = validityResponse && validityResponse.data && validityResponse.data.validity;
      alert(validity?'transaction succeeded':'transaction failed');
    } else {
      validity = false;
      alert('transaction failed');
    }

    return validity;
  }

  encodeRecord() {
    const form = {
      immunizationType: this.state.immunizationType,
      typeOfVaccine: this.state.typeOfVaccine,
      immunizationDate: this.state.immunizationDate,
      fundingSource: this.state.fundingSource,
      routeAndSide: this.state.routeAndSide,
      vaccineLot: this.state.vaccineLot,
      vaccineMfr: this.state.vaccineMfr,
      dateOnVIS: this.state.dateOnVIS,
      doctorId: this.state.doctorId
    }
    return btoa(JSON.stringify(form));
  }

  async extractWalletVars() {
    const {mnemonic} = this.state; //Read mnemonic

    // Assert Mnemonic is valid.
    if(!lightwallet.keystore.isSeedValid(mnemonic)){
      console.log('Show an error on the mnemonic form. The mnemonic is invalid.');
      return false;
    }
    await this.setKeystoreVariables();
    return true;
  }

  async setKeystoreVariables() {
    const {mnemonic, password} = this.state;

    let options = {
      password: password,
      seedPhrase: mnemonic,
      hdPathString: "m/44'/60'/0'/0"
    }

    var keystore;
    var pwDerivedKey

    keystore = await this.createVaultPromise(options);
    pwDerivedKey = await this.keyFromPasswordPromise(password, keystore);
    keystore.generateNewAddress(pwDerivedKey, 1);
    let address = keystore.getAddresses()[0]
    let privateKey = keystore.exportPrivateKey(address, pwDerivedKey);
    this.setState({
      keystore,
      pwDerivedKey,
      address,
      privateKey
    });
  }
  
  createVaultPromise(options) {
    return new Promise((resolve, reject) => {
      lightwallet.keystore.createVault(options, (err, ks) => {
        if(err) {
          reject(err);
        } else {
          resolve(ks);
        }
      }
    )})
  }

  keyFromPasswordPromise(password, keystore) {
    return new Promise((resolve, reject) => {
      keystore.keyFromPassword(password, (err, _pwDerivedKey) => {
        if(err) {
          reject(err);
        } else {
          resolve(_pwDerivedKey);
        }
      })
    })
  }

  signRecord(encodedRecord) {
    const {keystore, pwDerivedKey, address} = this.state;
    return lightwallet.signing.signMsg(keystore, pwDerivedKey, encodedRecord, address)
  }

  formatRawSignedRecord(signature) {
    return JSON.stringify({
      r: signature.r.toString('hex'),
      s: signature.s.toString('hex'),
      v: signature.v
    })
  }

  async encryptSignedRecord(record) {
    return await EthCrypto.encryptWithPublicKey(this.state.recipientPublicKey, record);
  }

  async getTxnParams(record, senderAddress, recipientAddress) {
    const url = `${process.env.VEGGIE_T_REX_API}getTransactionParams`;
    return await axios.post(url, {
      record,
      senderAddress,
      recipientAddress
    })
  }
  
  getSerializedTransaction(txnParams) {
    debugger;
    if(!txnParams || !txnParams.data) {
      return;
    }
    txnParams = txnParams.data;
    let tx = new EthereumTx(txnParams);
    tx.sign(Buffer.from(this.state.privateKey, 'hex'));
    const serializedTxn = '0x' + tx.serialize().toString('hex');
    return serializedTxn
  }

  async sendSerializedTxn(serializedTxn) {
    const url = `${process.env.VEGGIE_T_REX_API}sendTransaction`;
    return await axios.post(url, {
      signedTransaction: serializedTxn
    })
  }

  async validateTxnHash(txnHash) {
    const url = `${process.env.VEGGIE_T_REX_API}validateTransaction`;
    return await axios.post(url, {txnHash})
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Create Immunization record</h1>
        <h4>Fill record details</h4>
        <div className="inputs">
          <div className='form-group'>
            <label>
              <span>Immunization Type:</span>
              <input className='form-control' type="text" name="immunizationType" value={this.state.immunizationType} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              <span>Type Of Vaccine:</span>
              <input className='form-control' type="text" name="typeOfVaccine" value={this.state.typeOfVaccine} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              <span>Immunization Date:</span>
              <div className="form-control date">
                <DatePicker
                  selected={this.state.immunizationDate}
                  onChange={this.handleChangeDate}
                />
              </div>
            </label>
          </div>
          <div className='form-group'>
            <label>
              <span>Funding Source:</span>
              <input className='form-control' type="text" name="fundingSource" value={this.state.fundingSource} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              <span>Route And Side:</span>
              <input className='form-control' type="text" name="routeAndSide" value={this.state.routeAndSide} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              <span>Vaccine Lot:</span>
              <input className='form-control' type="text" name="vaccineLot" value={this.state.vaccineLot} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              <span>vaccine Mfr:</span>
              <input className='form-control' type="text" name="vaccineMfr" value={this.state.vaccineMfr} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              <span>Date on VIS:</span>
              <input className='form-control' type="text" name="dateOnVIS" value={this.state.dateOnVIS} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              <span>Vaccinator:</span>
              <input className='form-control' type="text" name="doctorId" value={this.state.doctorId} onChange={this.handleInputChange} />
            </label>
          </div>
        </div>

        <h4>Sign the immunization record</h4>
        <div className="inputs">
          <div className='form-group'>
            <label>
              <span>mnemonic:</span>
              <input className='form-control' type="text" name="mnemonic" value={this.state.mnemonic} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              <span>password:</span>
              <input className='form-control' type="text" name="password" value={this.state.password} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              <span>public key:</span>
              <input className='form-control' type="text" name="recipientPublicKey" value={this.state.recipientPublicKey} onChange={this.handleInputChange} />
            </label>
          </div>
        </div>

        <div>
          <button className='btn btn-primary' type="submit" value="Submit">Submit</button>
        </div>
      </form>
    );
  }
}

export default CreateRecordView;