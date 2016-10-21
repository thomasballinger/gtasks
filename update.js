const ReactDOM = require('react-dom');

const auth = require('./auth');
const view = require('./views').view;
const currentState = require('./model').model;

/* Update */
// Within this function the global variable currentState is mutated
const update = (msgType, payload) => {
  switch (msgType){
    case 'googleScriptLoaded':
      gapi.auth.authorize(
        {
          'client_id': auth.CLIENT_ID,
          'scope': auth.SCOPES.join(' '),
          'immediate': true
        }, handleAuthResult);
      break;
    case 'authed':
      currentState.authState = 'authed';
      gapi.client.load('tasks', 'v1', ()=>update('tasksAPILoaded'));
      break;
    case 'notAuthed':
      currentState.authState = 'notAuthed';
      break;
    case 'tasksAPILoaded':
      gapi.client.tasks.tasklists.list({ 'maxResults': 10 })
        .execute( (resp) => update('taskLists', resp.items) );
      break;
    case 'taskLists':
      currentState.taskLists = payload ? payload.map( (taskList) => {
        taskList.updated = Date.parse(taskList.updated);
        return taskList;
      }) : [];
      break;
    case 'authClick':
      gapi.auth.authorize(
        {client_id: auth.CLIENT_ID,
         scope: auth.SCOPES,
         immediate: false
        }, handleAuthResult);
      break;
    default:
      console.log(msgType, payload);
      throw Error('Got unknown message: '+msgType+': '+payload);
  }
  ReactDOM.render(view(currentState), document.getElementById('example'));
};

const handleAuthResult = (result) => {
  if (result && !result.error) {
    update('authed');
  } else {
    update('notAuthed');
  }
};


module.exports.update = update;
