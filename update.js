/* Model */
var currentState = {
  taskLists : [{title: 'a', updated: 'never'}, {title: 'b', updated: 'recently'}],
              // Each task list has a title, an id, and an updated field: RFC 3339 timestamp
              // https://developers.google.com/google-apps/tasks/v1/reference/tasklists#resource
  authState : 'dunnoYet'   // 'dunnoYet', 'authed', 'notAuthed'
};

/* Update */
// Within this function the global variable currentState is mutated
const update = (msgType, payload) => {
  console.log('got messageType:', msgType);
  switch (msgType){
    case 'googleScriptLoaded':
      gapi.auth.authorize(
        {
          'client_id': CLIENT_ID,
          'scope': SCOPES.join(' '),
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
      console.log('got task lists!');
      currentState.taskLists = payload ? payload.map( (taskList) => {
        taskList.updated = Date.parse(taskList.updated);
        return taskList;
      }) : [];
      break;
    case 'authClick':
      gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
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

