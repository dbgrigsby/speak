import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import { ReactMic } from 'react-mic';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
   Legend, Radar, RadarChart, PolarGrid, PolarRadiusAxis, PolarAngleAxis,
 BarChart, Bar, ReferenceLine, AreaChart, Area} from 'recharts';
import uuid from 'uuid';
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      record: false,
      uuid:null
    }

    this.onStop = this.onStop.bind(this);
  }
  startRecording = () => {
    this.setState({
      record: true
    });
  }

  stopRecording = () => {
    this.setState({
      record: false
    });
  }

  onStop(recordedBlob) {
    //const toBase64 = require('arraybuffer-base64');
    //const fd = new FormData();
    //console.log(recordedBlob);

    var fileReader = new FileReader();
    fileReader.onload = function(event) {
      const uuidv1 = require('uuid/v1');
      const toBase64 = require('arraybuffer-base64');
      var res = event.originalTarget.result;
      res = toBase64(res);
      axios.post('http://127.0.0.1:5000/submit_audio', {
        uuid:uuidv1(),
        file:res
      })
      .then(function (response) {
        this.setState({
          uuid: response.data.data.uuid
        });
      }.bind(this))
      .catch(function(error) {
        console.log(error)
      });
    }.bind(this);
    fileReader.readAsArrayBuffer(recordedBlob.blob);


    //var base64Version = toBase64(arrayBuffer);
    //fd.append("file",recordedBlob.blob,"file.webm")
  }

  componentWillMount() {
    axios.get('http://127.0.0.1:5000/').then(function(response) {
      if (response.data.test && response.data.test.id) {
        this.setState({
          id: response.data.test.id
        });
      }
    }.bind(this));
  }

  render() {
      const data = [
        {name: 'Time Group A', duplicatepercent: 4, stutterwordpercent: 2, amt: 2400},
        {name: 'Time Group B', duplicatepercent: 3, stutterwordpercent: 13, amt: 2210},
        {name: 'Time Group C', duplicatepercent: 2, stutterwordpercent: 9, amt: 2290},
        {name: 'Time Group D', duplicatepercent: 2, stutterwordpercent: 3, amt: 2000},
        {name: 'Time Group E', duplicatepercent: 1, stutterwordpercent: 4, amt: 2181},
        {name: 'Time Group F', duplicatepercent: 2, stutterwordpercent: 3, amt: 2500},
        {name: 'Time Group G', duplicatepercent: 9, stutterwordpercent: 3, amt: 2100},
  ];
  const data2 = [
    { subject: 'Anger', A: .12, B: 110, fullMark: .69 },
    { subject: 'Disgust', A: .05, B: 130, fullMark: .69 },
    { subject: 'Sadness', A: .43, B: 130, fullMark: .69 },
    { subject: 'Joy', A: .69, B: 100, fullMark: .69 },
    { subject: 'Fear', A: .45, B: 90, fullMark: .69 },
];
const data3 = [
      {name: 'Time Group A', wpm: 123},
      {name: 'Time Group B', wpm: 140},
      {name: 'Time Group C', wpm: 135},
      {name: 'Time Group D'},
      {name: 'Time Group E', wpm: 100},
      {name: 'Time Group F', wpm: 80},
      {name: 'Time Group G', wpm: 120},
];
      return (
        <div className="App">
        <h3>Speak</h3>
          <ReactMic
            record={this.state.record}
            onStop={this.onStop}
             />
          <button onClick={this.startRecording} type="button">Start</button>
          <button onClick={this.stopRecording} type="button">Stop</button>
          <center>
          <h5>Stutter and Duplicate Percentages for your speech</h5>
          <LineChart width={600} height={300} data={data}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
              <XAxis dataKey="name"/>
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Legend />
              <Line type="monotone" dataKey="stutterwordpercent" stroke="#8884d8" activeDot={{r: 8}}/>
              <Line type="monotone" dataKey="duplicatepercent" stroke="#82ca9d" />
         </LineChart>

        <h5>Sentiment Analysis of your speech</h5>
        <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data2}>
          <Radar name="Sentiments" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.9}/>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis/>
        </RadarChart>

        <h5>Words Per Minute Trends</h5>

        <AreaChart width={600} height={200} data={data3}
              margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Area connectNulls={true} type='monotone' dataKey='wpm' stroke='#8884d8' fill='#8884d8' />
        </AreaChart>

        </center>
        <p/>
        <p/>
      </div>
    );
  }
}

export default App;
