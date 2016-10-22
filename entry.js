const ReactDOM = require('react-dom');
const React = require('react');

const TasksApp = require('./views').TasksApp;

window.googleScriptLoaded = () => {
  console.log("google script loaded!");
  ReactDOM.render(React.createElement(TasksApp, {gapiLoaded: true}), document.getElementById('example'));
}

ReactDOM.render(React.createElement(TasksApp, {gapiLoaded: false}), document.getElementById('example'));

