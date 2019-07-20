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
      date: new Date(),
      nextDate: new Date()
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

  handleSubmit(event) {
    console.log(this.state)
    event.preventDefault();
    axios.post('localhost:8080/createRecord', this.state).then(response => console.log(response));
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