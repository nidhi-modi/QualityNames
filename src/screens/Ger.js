import React from "react";
import '../styles/Ger.css';
import 'react-dropdown/style.css';
import { Container, Grid, Header, List, Table } from "semantic-ui-react";


var tlName;
var clipping = "Clipping";
var twisting = "Twisting";
var pruning = "Pruning";
var dropping = "Dropping";
var deleafing = "Deleafing";
var picking = "Picking";
var pruneArch = "PruneArch";

class Ger extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      teamLeaderName: '',
      workerName: '',
      adiNumber: '',
      combinedData: [],
      otherTLName: '',
      TL1: [],

    };

    this.handleWorkersNameChange = this.handleWorkersNameChange.bind(this);
    this.handleAdiChange = this.handleAdiChange.bind(this);
    this.handleTLChange = this.handleTLChange.bind(this);
    this.getTLName = this.getTLName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getJobDetails = this.getJobDetails.bind(this);



  }



  getDataFromGoogleSheet = () => {

    const scriptUrl1 = 'https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec';
    const url1 = `${scriptUrl1}?callback=ctrlq&action=${'doGetData'}`;

    console.log("URL : " + url1);
    fetch(url1).then((response) => response.json())
      .then((responseJson) => {

        this.setState({ combinedData: responseJson })
        if (responseJson !== null) {

          //TL 1
          const jobAndTeamLeader = d => d.TeamLeader === this.state.otherTLName;

          const filteredData = this.state.combinedData.items.filter(jobAndTeamLeader);

          this.setState({ TL1: filteredData })
          //END


        }

      }).catch((error) => {

        console.log(error);
      });

  }

  handleWorkersNameChange(event) {

    var str = event.target.value.substring(0, 1).toUpperCase() + event.target.value.substring(1).toLowerCase()
    this.setState({ workerName: str });

  }

  handleTLChange(event) {
    this.setState({ teamLeaderName: event.target.value });

  }

  getTLName(event) {

    tlName = event.target.value;

    this.setState({ otherTLName: tlName });

    // hide when noething selected

    this.getDataFromGoogleSheet();

  }

  getJobDetails(event) {

    const jobValue = event.target.value;

    console.log("NAME : " + jobValue);


  }

  handleAdiChange(event) {

    this.setState({ adiNumber: event.target.value });

  }

  handleSubmit(event) {

    if (this.state.teamLeaderName === "") {

      alert('Please select team leader from the list');
      event.preventDefault();

    } else {

      event.preventDefault();

      this.sendDataToGoogleSheet();

    }

  }

  sendDataToGoogleSheet = () => {

    var that = this;

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec';
    const url = `${scriptUrl}?
    callback=ctrlq&action=${'doPostData'}&workers_name=${that.state.workerName}&adi_number=${that.state.adiNumber}&teamleader_name=${that.state.teamLeaderName}`;

    console.log("URL : " + url);
    fetch(url, { mode: 'no-cors' }).then(
      () => {
        alert("Data Send");
        this.setState({
          workerName: '',
          adiNumber: '',
          teamLeaderName: ''
        })

        document.getElementById("name_select").selectedIndex = 0; //1 = option 2

      },
    );

  }




  render() {
    return (
      <div className="Ger">


        <br />
        <br />
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <input className="text-input" type="text" value={this.state.workerName} onChange={this.handleWorkersNameChange} />


          </label>

          <br />
          <br />

          <label>
            ADI:

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <input className="text-input" type="text" value={this.state.adiNumber} onChange={this.handleAdiChange} />

          </label>

          <br />
          <br />

          <label>
            TL:

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <select className="text-input" id="name_select" name="leaders" onChange={this.handleTLChange}>
              <option value="none" selected="selected">SELECT</option>
              <option value="Deep Singh">Deep Singh</option>
              <option value="Nau Pesa">Nau Pesa</option>
              <option value="Marsha Stone">Marsha Stone</option>
            </select>

          </label>

          <br />
          <br />

          <input className="button-submit" type="submit" />

        </form>

        <br />

        <h3 className="text_header_style">Select Teamleader name to assign jobs</h3>

        <select className="button-dropdown" name="leaders" onChange={this.getTLName}>
          <option value="none" selected="selected">SELECT</option>
          <option value="Deep Singh">Deep Singh</option>
          <option value="Nau Pesa">Nau Pesa</option>
          <option value="Marsha Stone">Marsha Stone</option>

        </select>

        <br />
        <br />

        {this.state.TL1.length > 0 ?

          <div className="align-center">
            <Table singleLine>
              <Table.Header>
                <Table.Row>

                  <Table.HeaderCell className="align-space">NAME</Table.HeaderCell>
                  <Table.HeaderCell className="align-space">CLIPPING</Table.HeaderCell>
                  <Table.HeaderCell className="align-space">TWISTING</Table.HeaderCell>
                  <Table.HeaderCell className="align-space">PRUNING</Table.HeaderCell>
                  <Table.HeaderCell className="align-space">DROPPING</Table.HeaderCell>
                  <Table.HeaderCell className="align-space">DELEAFING</Table.HeaderCell>
                  <Table.HeaderCell className="align-space">PICKING</Table.HeaderCell>
                  <Table.HeaderCell>PRUNE &#38; ARCH</Table.HeaderCell>



                </Table.Row>
              </Table.Header>

              <br />


              <Table.Body>
                {this.state.TL1.map(el => {
                  return (
                    <Table.Row key={el.Name}>
                      <Table.Cell className="align-space">{el.Name}</Table.Cell>
                      <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Clipping" name={el.Name + " " + clipping + " " + this.state.otherTLName} onChange={this.getJobDetails} value={el.Name + " " + clipping + " " + this.state.otherTLName} /></Table.Cell>
                      <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Twisting" name={el.Name + " " + twisting + " " + this.state.otherTLName} onChange={this.getJobDetails} value={el.Name + " " + twisting + " " + this.state.otherTLName} /></Table.Cell>
                      <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Pruning" name={el.Name + " " + pruning + " " + this.state.otherTLName} onChange={this.getJobDetails} value={el.Name + " " + pruning + " " + this.state.otherTLName} /></Table.Cell>
                      <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Dropping" name={el.Name + " " + dropping + " " + this.state.otherTLName} onChange={this.getJobDetails} value={el.Name + " " + dropping + " " + this.state.otherTLName} /></Table.Cell>
                      <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Deleafing" name={el.Name + " " + deleafing + " " + this.state.otherTLName} onChange={this.getJobDetails} value={el.Name + " " + deleafing + " " + this.state.otherTLName} /></Table.Cell>
                      <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Picking" name={el.Name + " " + picking + " " + this.state.otherTLName} onChange={this.getJobDetails} value={el.Name + " " + picking + " " + this.state.otherTLName} /></Table.Cell>
                      <Table.Cell> <input type="checkbox" id="PruneArch" className="largerCheckbox" name={el.Name + " " + pruneArch + " " + this.state.otherTLName} onChange={this.getJobDetails} value={el.Name + " " + pruneArch + " " + this.state.otherTLName} /></Table.Cell>

                    </Table.Row>


                  );
                })}
              </Table.Body>


              <br />
              <br />
              <br />
            </Table>
          </div>
          : null}
        <br />
        <br />
      </div>


    );
  }
}

export default Ger;