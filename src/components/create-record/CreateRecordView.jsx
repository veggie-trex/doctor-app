import React from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Create Immunization record</h1>
        <div>
          <label>
            Name:
            <input type="text" value={this.state.value} onChange={this.handleChangeName} />
          </label>
        <div>
        </div>
          <label>
            Date:
          <DatePicker
              selected={this.state.date}
              onChange={this.handleChangeDate}
            />
          </label>
        </div>
        <div>
          <label>
            Next immunization date:
          <DatePicker
              selected={this.state.nextDate}
              onChange={this.handleChangeNextDate}
            />
          </label>
        </div>
        <div>
          <label>
            Type:
            <input type="text" value={this.state.value} onChange={this.handleChangeType} />
          </label>
        <div>
        </div>
          <label>
            administered by:
            <input type="text" value={this.state.doctor} onChange={this.handleChangeDoctor} />
          </label>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    );
  }
}

export default CreateRecordView;