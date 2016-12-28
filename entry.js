const ReactDOM = require('react-dom');
const React = require('react');

const TasksApp = require('./views').TasksApp;
const TaskListApp = require('./views').TaskListApp;
const SingleTaskDisplay = require('./views').SingleTaskDisplay;
const HabiticaDailiesList = require('./views').HabiticaDailiesList;

/*
window.googleScriptLoaded = () => {
  ReactDOM.render(React.createElement(TasksApp, {gapiLoaded: true}), document.getElementById('example'));
}
*/

//ReactDOM.render(React.createElement(TasksApp, {gapiLoaded: false}), document.getElementById('example'));
ReactDOM.render(React.createElement(SingleTaskDisplay, {tasklistId: '@default'}), document.getElementById('example1'));
ReactDOM.render(React.createElement(TasksApp), document.getElementById('example2'));
ReactDOM.render(React.createElement(HabiticaDailiesList, {tasklistId: 'MTY1NTM2MzEzNDEwNDkxNzY4NjE6OTk3MTEyNzgzOjA'}), document.getElementById('example3'));

window.currentBooksWidget = (elementId)=>{
  ReactDOM.render(React.createElement(TaskListApp, {tasklistId: 'MTY1NTM2MzEzNDEwNDkxNzY4NjE6MTYzMTA4NjM5Njow'}), document.getElementById(elementId));
}
