const ReactDOM = require('react-dom');
const React = require('react');

const TasksApp = require('./views').TasksApp;
const TaskListApp = require('./views').TaskListApp;

/*
window.googleScriptLoaded = () => {
  ReactDOM.render(React.createElement(TasksApp, {gapiLoaded: true}), document.getElementById('example'));
}
*/

//ReactDOM.render(React.createElement(TasksApp, {gapiLoaded: false}), document.getElementById('example'));
ReactDOM.render(React.createElement(TaskListApp), document.getElementById('example1'));
ReactDOM.render(React.createElement(TasksApp), document.getElementById('example2'));
