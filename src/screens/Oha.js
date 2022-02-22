import React from "react";
import '../styles/Oha.css';
import 'react-dropdown/style.css';
import { Container, Grid, Header, List, Table } from "semantic-ui-react";
import logo from '../img/delete.png'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from "react-toastify";
import { Audio, Puff, Bars, Hearts, ThreeDots } from 'react-loader-spinner'


var tlName;
var clipping = "Clipping";
var twisting = "Twisting";
var pruning = "Pruning";
var dropping = "Dropping";
var deleafing = "Deleafing";
var picking = "Picking";
var pruneArch = "Prune and Arch";

var checkedBox;

var response = [];
var data2 = [];



class Oha extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      teamLeaderName: '',
      combinedTLWorkers: '',
      workerName: '',
      adiNumber: '',
      combinedData: [],
      otherTLName: '',
      TL1: [],
      assignJobs: '',
      jobList: [],
      loading: false,

    };

    this.handleWorkersNameChange = this.handleWorkersNameChange.bind(this);
    this.handleAdiChange = this.handleAdiChange.bind(this);
    this.handleTLChange = this.handleTLChange.bind(this);
    this.getTLName = this.getTLName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAsignJobsButton = this.handleAsignJobsButton.bind(this);
    this.getJobDetails = this.getJobDetails.bind(this);



  }



  getDataFromGoogleSheet = () => {

    this.setState({ loading: true })

    const scriptUrl1 = 'https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec';
    const url1 = `${scriptUrl1}?callback=ctrlq&action=${'doGetOhaData'}`;

    console.log("URL : " + url1);
    fetch(url1).then((response) => response.json())
      .then((responseJson) => {

        this.setState({ combinedData: responseJson })
        if (responseJson !== null) {

          //TL 1
          const jobAndTeamLeader = d => d.TeamLeader === this.state.otherTLName;

          const filteredData = this.state.combinedData.items.filter(jobAndTeamLeader);

          const sortedData = filteredData.sort((a, b) => a.Name.localeCompare(b.Name))

          this.setState({ TL1: sortedData })
          //END

          console.log("Names received!!");


          this.getCheckListFromGoogle()


        }

      }).catch((error) => {

        console.log(error);
        this.setState({ loading: false })

      });

  }

  getCheckListFromGoogle = () => {

    console.log("Checklist data from Google in progress..");

    const scriptUrl1 = 'https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec';
    const url1 = `${scriptUrl1}?callback=ctrlq&action=${'doGetChecklistOhaData'}`;

    console.log("URL : " + url1);
    fetch(url1).then((response) => response.json())
      .then((responseJson) => {

        data2 = responseJson;

        this.setState(
          { jobList: responseJson }

          , () => {
            this.afterSetStateFinished(data2);
          });




      }).catch((error) => {

        console.log(error);
        this.setState({ loading: false })


      });

  }

  handleWorkersNameChange(event) {

    var str = this.titleCase(event.target.value);
    this.setState({ workerName: str });

  }

  handleTLChange(event) {

    this.setState({

      teamLeaderName: event.target.value,
      combinedTLWorkers: this.state.workerName + " " + event.target.value
    });


  }

  afterSetStateFinished(data) {

    this.setState({ loading: false })

    response = data;


  }

  getTLName(event) {

    tlName = event.target.value;

    this.setState({ otherTLName: tlName });

    // hide when noething selected

    this.getDataFromGoogleSheet();

  }


  getJobDetails(event) {

    const jobValue = event.target.value;
    this.sendData(jobValue);

  }





  handleDeleteClick(deleteNames, names) {


    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete ' + names + ' from the list.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {

            const scriptUrl = 'https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec';
            const url = `${scriptUrl}?
          callback=ctrlq&action=${'doDeleteOhaNames'}&delete_names=${deleteNames}`;

            console.log("URL : " + url);
            fetch(url, { mode: 'no-cors' }).then(
              () => {

                console.log(deleteNames + " Deleted");

                this.getDataFromGoogleSheet()

                toast.success("Deleted!!")

              },
            );

          },

        },
        {
          label: 'No',
          style: "cancel",
        }
      ]
    });




  }





  sendData(jobs) {

    console.log("NAME LIST: " + jobs);

    var that = this;

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec';
    const url = `${scriptUrl}?
    callback=ctrlq&action=${'doPostAssignJobsOhaData'}&assign_jobs=${jobs}`;

    console.log("URL : " + url);
    fetch(url, { mode: 'no-cors' }).then(
      () => {

        console.log("Data send");

      },
    );



  }

  handleAdiChange(event) {

    this.setState({ adiNumber: event.target.value });

  }



  userExists(name) {

    //console.log("Parse :"+JSON.stringify(response));

    if (response.length) {

      console.log("Data Available");

      /*response.items.map(function (item) {
        if (item.JobList.includes(name)) {
          console.log(name+ " Yes");
          return true;
        } else {
          console.log(name+ " No");
          return false;
        }
      });*/

      //EXAMPLE

      const employeesUnderIds = response.items.map(item => item.JobList);

      if (employeesUnderIds.includes(name)) {

        return true;

      }

      //END

    } else {

      console.log("Empty Data");
    }

  }



  handleAsignJobsButton(event) {




  }

  handleSubmit(event) {

    if (this.state.teamLeaderName === "" || this.state.teamLeaderName === "SELECT" || this.state.teamLeaderName === null) {

      toast.error("Please select team leader from the list.")


      event.preventDefault();


    } else {

      event.preventDefault();

      this.sendDataToGoogleSheet();

    }

  }

  titleCase(str) {

    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  }

  sendDataToGoogleSheet = () => {

    var that = this;

    const { workerName } = that.state;
    const { adiNumber } = that.state;


    if (workerName) {
      if (adiNumber) {

        const scriptUrl = 'https://script.google.com/macros/s/AKfycbymOKlhOo1RztVgk_J35pzX3WOMID2Zw0UuPe6pYGxB9OvjCiXf/exec';
        const url = `${scriptUrl}?
    callback=ctrlq&action=${'doPostOhaData'}&workers_name=${that.state.workerName}&adi_number=${that.state.adiNumber}&teamleader_name=${that.state.teamLeaderName}&combined_name=${that.state.combinedTLWorkers}`;

        console.log("URL : " + url);
        fetch(url, { mode: 'no-cors' }).then(
          () => {
            toast.success("Data Send")
            this.setState({
              workerName: '',
              adiNumber: '',
              teamLeaderName: '',
              combinedTLWorkers: ''
            })

            document.getElementById("name_select").selectedIndex = 0; //1 = option 2

          },
        );

      } else {

        toast.error("Please select team leader from the list.")


      }
    } else {

      toast.error("Please enter ADI number.")

    }

  }

  render() {


    if (this.state.loading) {
      return (
        <div className="OhaLoader">
          <ThreeDots
            heigth="100"
            width="100"
            color='#4CAF50'
          />
        </div>);
    }
    else {

      return (
        <div className="Oha">


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
                <option value="Missy Brown">Missy Brown</option>
                <option value="Bryan Morrisan">Bryan Morrisan</option>
                <option value="Ravi Sarju">Ravi Sarju</option>
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
            <option value="Missy Brown">Missy Brown</option>
            <option value="Bryan Morrisan">Bryan Morrisan</option>
            <option value="Ravi Sarju">Ravi Sarju</option>

          </select>

          <br />


          <h3 className="text_header_style2">{this.state.otherTLName}</h3>

          {this.state.TL1.length > 0 ?

            <form onSubmit={this.handleAsignJobsButton}>
              <div className="align-center">
                <Table singleLine>
                  <Table.Header>
                    <Table.Row>

                      <Table.HeaderCell className="align-space">NAME</Table.HeaderCell>
                      <Table.HeaderCell className="align-space">ADI</Table.HeaderCell>
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
                          <Table.Cell className="align-space">{el.Adi}</Table.Cell>
                          <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Clipping" name={el.Name + " " + clipping + " " + this.state.otherTLName} defaultChecked={this.userExists(el.Name + " " + clipping + " " + this.state.otherTLName)} onChange={this.getJobDetails} value={el.Name + " " + clipping + " " + this.state.otherTLName} /></Table.Cell>
                          <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Twisting" name={el.Name + " " + twisting + " " + this.state.otherTLName} defaultChecked={this.userExists(el.Name + " " + twisting + " " + this.state.otherTLName)} onChange={this.getJobDetails} value={el.Name + " " + twisting + " " + this.state.otherTLName} /></Table.Cell>
                          <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Pruning" name={el.Name + " " + pruning + " " + this.state.otherTLName} defaultChecked={this.userExists(el.Name + " " + pruning + " " + this.state.otherTLName)} onChange={this.getJobDetails} value={el.Name + " " + pruning + " " + this.state.otherTLName} /></Table.Cell>
                          <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Dropping" name={el.Name + " " + dropping + " " + this.state.otherTLName} defaultChecked={this.userExists(el.Name + " " + dropping + " " + this.state.otherTLName)} onChange={this.getJobDetails} value={el.Name + " " + dropping + " " + this.state.otherTLName} /></Table.Cell>
                          <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Deleafing" name={el.Name + " " + deleafing + " " + this.state.otherTLName} defaultChecked={this.userExists(el.Name + " " + deleafing + " " + this.state.otherTLName)} onChange={this.getJobDetails} value={el.Name + " " + deleafing + " " + this.state.otherTLName} /></Table.Cell>
                          <Table.Cell className="align-space"> <input className="largerCheckbox" type="checkbox" id="Picking" name={el.Name + " " + picking + " " + this.state.otherTLName} defaultChecked={this.userExists(el.Name + " " + picking + " " + this.state.otherTLName)} onChange={this.getJobDetails} value={el.Name + " " + picking + " " + this.state.otherTLName} /></Table.Cell>
                          <Table.Cell className="align-space"> <input type="checkbox" id="PruneArch" className="largerCheckbox" name={el.Name + " " + pruneArch + " " + this.state.otherTLName} defaultChecked={this.userExists(el.Name + " " + pruneArch + " " + this.state.otherTLName)} onChange={this.getJobDetails} value={el.Name + " " + pruneArch + " " + this.state.otherTLName} /></Table.Cell>
                          <Table.Cell className="align-space-top" onClick={() => this.handleDeleteClick(el.Name + " " + this.state.otherTLName, el.Name)} value={el.Name + " " + this.state.otherTLName}> <img src={logo} /> </Table.Cell>

                        </Table.Row>


                      );
                    })}
                  </Table.Body>


                  <br />
                  <br />
                </Table>



              </div>

            </form>


            : null}
          <br />
          <br />
        </div>


      );

    }
  }
}

export default Oha;