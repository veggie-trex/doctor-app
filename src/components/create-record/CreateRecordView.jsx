import React from 'react';
import DatePicker from "react-datepicker";
import axios from 'axios';

import "react-datepicker/dist/react-datepicker.css";
import "./CreateRecordView.css"

class CreateRecordView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      type: '',
      doctor: '',
      mnemonic: '',
      password: '',
      date: '',
      nextDate: ''
    };
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeNextDate = this.handleChangeNextDate.bind(this);
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
      date: date
    });
  }

  handleChangeNextDate(date) {
    this.setState({
      nextDate: date
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post(`${process.env.VEGGIE_T_REX_API}patients/records`, this.state).then(response => console.log(response));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Create Immunization record</h1>
        <h4>Fill record details</h4>
        <div className='form-group'>
          <label>
            Name:
            <input className='form-control' type="text" name="name" value={this.state.name} onChange={this.handleInputChange} />
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
            <input className='form-control' type="text" name="type" value={this.state.type} onChange={this.handleInputChange} />
          </label>
        </div>
        <div className='form-group'>
          <label>
            administered by:
            <input className='form-control' type="text" name="doctor" value={this.state.doctor} onChange={this.handleInputChange} />
          </label>
        </div>
        <h4>Sign the immunization record</h4>
        <div className='form-group'>
          <label>
          mnemonic:
            <input className='form-control' type="text" name="mnemonic" value={this.state.mnemonic} onChange={this.handleInputChange} />
          </label>
        </div>
        <div className='form-group'>
          <label>
          password:
            <input className='form-control' type="text" name="password" value={this.state.password} onChange={this.handleInputChange} />
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