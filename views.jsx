var React = require('react');
/* Views */

const view = (state) => {
  return React.createElement('div', {}, [
    taskListsView({ taskLists: state.taskLists} ),
    authorizeDivView( {isAuthed: state.authState} )
  ]);
};

const taskListsView = props => {
  if (props.taskLists){
    const titleAgoObjs = props.taskLists.map( l => { return {'title': l.title, 'ago': Math.round((new Date() - l.updated) / 1000) + ' seconds ago'}; } );
    return React.createElement('div', {}, [
      React.createElement('h1', {key:'header'}, "Task Lists:"),
      list( {data: props.taskLists.map( l => l.title + ' updated ' + Math.round((new Date() - l.updated) / 1000) + ' seconds ago')} ),
      table({headers: ['title', 'ago'], data: titleAgoObjs})
    ]);
  } else {
    return (
      <h1 key="header"> "No task lists or still loading" </h1>
    );
  }
};

const listItem = props => <li> { props.data.toString() } </li>;
const list = props => <ul className="hello"> { props.data.map( d => listItem({data: d}) ) } </ul>
const table = props => {
  const dataRows = props.data.map( d => props.headers.map( h => d[h] ) );
  return (<table>
    {[].concat([tableHeaders( {headers: props.headers} )], dataRows.map( (dataRow) => tableRow({fields: dataRow}) ))}
  </table>);
};
const tableHeaders = props => React.createElement('tr', {}, props.headers.map( h => React.createElement('th', {}, h) ));
const tableRow = props => React.createElement('tr', {}, props.fields.map( f => React.createElement('td', {}, f) ));

const authorizeDivView = props => {
  if (props.isAuthed !== 'notAuthed'){
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

module.exports.view = view;
