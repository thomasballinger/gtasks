const ReactDOM = require('react-dom');
const React = require('react');
const TaskListApp = require('./views.jsx').TaskListApp;
const SingleTaskDisplay = require('./views.jsx').SingleTaskDisplay;

window.gtasksTableWidget = (element, taskListId, maxItems)=>{
  ReactDOM.render(React.createElement(TaskListApp, {
    tasklistId: taskListId,
    maxResults: maxItems
  }), element);
}
window.gtasksTopItem = (element, taskListId)=>{
  ReactDOM.render(React.createElement(SingleTaskDisplay, {
    tasklistId: taskListId,
    defaultContent: element.textContent
  }), element);
}
