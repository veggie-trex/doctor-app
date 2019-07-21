import React from 'react';
import DatePicker from "react-datepicker";
import axios from 'axios';

import "react-datepicker/dist/react-datepicker.css";
import "./CreateRecordView.css"

class CreateRecordView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
      password: ''
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

  handleSubmit(event) {
    event.preventDefault();
    axios.post(`${process.env.VEGGIE_T_REX_API}records`, this.state).then(response => console.log(response));
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
        </div>

        <div>
          <button className='btn btn-primary' type="submit" value="Submit">Submit</button>
        </div>
      </form>
    );
  }
}

export default CreateRecordView;