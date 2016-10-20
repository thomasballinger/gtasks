/* Views */

const view = (state) => {
  return React.createElement('div', {}, [
    taskListsView(state.taskLists),
    authorizeDivView(state.authState)
  ]);
};

const taskListsView = (taskLists) => {
  if (taskLists){
    titleAgoObjs = taskLists.map( l => { return {'title': l.title, 'ago': Math.round((new Date() - l.updated) / 1000) + ' seconds ago'}; } );
    return React.createElement('div', {}, [
      React.createElement('h1', {key:'header'}, "Task Lists:"),
      //list(taskLists.map( l => l.title + ' updated ' + Math.round((new Date() - l.updated) / 1000) + ' seconds ago')),
      table(['title', 'ago'], titleAgoObjs)
    ]);
  } else {
    return React.createElement('h1', {key:'header'}, "No task lists or still loading");
  }
};

const listItem = (s, i) => React.createElement("li", {key: i}, s.toString());
const list = data => React.createElement("ul", { className: "hello", key:'imalist' }, data.map(listItem));
const table = (headers, data) => {
  const dataRows = data.map( d => headers.map( h => d[h] ) );
  return React.createElement('table', {}, [].concat([tableHeaders(headers)], dataRows.map(tableRow)));
};
const tableHeaders = headers => React.createElement('tr', {}, headers.map( h => React.createElement('th', {}, h) ));
const tableRow = fields => React.createElement('tr', {}, fields.map( f => React.createElement('td', {}, f) ));

const authorizeDivView = (isAuthed) => {
  if (isAuthed !== 'notAuthed'){
    return React.createElement('span', {}, "You're authorized");
  }
  return React.createElement('div', {id: 'authorize-div'}, [
      React.createElement('span', {}, 'Authorize access to Google Tasks API'),
      React.createElement('button', {
        id: 'authorize-button',
        onClick: () => [update('authClick'), false][1]
      }, 'Authorize')
    ]);
};
