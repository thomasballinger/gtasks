const React = require('react');
const auth = require('./auth');

class TasksApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      taskLists: [{title: 'abc', updated: 'never', id: '123123'}],
      authState: 'dunnoYet'
    };
  }
  render() {
    return (<div>
      <TaskListsView taskLists={this.state.taskLists}/>
      <AuthorizeDivView
        isAuthed={this.state.authState}
        onClick={this.onAuthClick.bind(this)}
      />
    </div>);
  }

  componentWillReceiveProps(nextProps){
    if (!this.props.gapiLoaded && nextProps.gapiLoaded){
      this.onGoogleScriptLoaded();
    }
  }

  onGoogleScriptLoaded() {
    gapi.auth.authorize(
      {
        'client_id': auth.CLIENT_ID,
        'scope': auth.SCOPES.join(' '),
        'immediate': true
      }, this.handleAuthResult.bind(this));
  }
  onTaskAPILoaded(){
    gapi.client.tasks.tasklists.list({ 'maxResults': 10 })
      .execute( (resp) => this.taskListsLoaded(resp.items) );
  }
  taskListsLoaded(taskLists){
    this.setState({taskLists: taskLists ? taskLists.map( (taskList) => {
      taskList.updated = Date.parse(taskList.updated);
      return taskList;
    }) : []});
  }
  onAuthClick(){
    console.log('trying to auth...', auth.CLIENT_ID, auth.SCOPES);
    gapi.auth.authorize(
      {client_id: auth.CLIENT_ID,
       scope: auth.SCOPES,
       immediate: false
      }, ()=>this.handleAuthResult());
  }
  handleAuthResult(result) {
    if (result && !result.error) {
      this.setState({authState: 'authed'})
      gapi.client.load('tasks', 'v1', ()=>this.onTaskAPILoaded());
    } else {
      this.setState({authState: 'notAuthed'})
    }
  };
}


const TaskListsView = props => (
  props.taskLists ?
    (<div>
      <h1> Task Lists: </h1>
      <List data={ props.taskLists.map( l => ({
        data: l.title + ' updated ' + Math.round((new Date() - l.updated) / 1000) + ' seconds ago',
        key: l.id
      }))}/>
      <Table headers={['title', 'ago']} dataKeyObjs={props.taskLists.map( l => ({
          data: {'title': l.title, 'ago': Math.round((new Date() - l.updated) / 1000) + ' seconds ago'},
          key: l.id,
      }))}/>
      </div>)
    :
      <h1 key="header"> "No task lists or still loading" </h1>)

const ListItem = props => <li> { props.data.toString() } </li>;
const List = props => (
  <ul className="hello">
    { props.data.map( d => <ListItem data={d.data} key={d.key}/> ) }
  </ul>)
const Table = props => {
  const keyDataObjs = props.dataKeyObjs.map( d => ({
    key: d.key,
    data: props.headers.map( h => d.data[h])
  }));
  return (<table>
    <tbody>
    {[].concat([ <TableHeaders headers={props.headers} key='the header'></TableHeaders> ], keyDataObjs.map( (dataRow) => <TableRow fields={dataRow.data} key={dataRow.key}/> ))}
      </tbody>
  </table>);
};
const TableHeaders = props => (<tr>
   { props.headers.map( h => <th key={h}>{h}</th> ) }
  </tr>);
const TableRow = props => (<tr>
   { props.fields.map( (f, i) => <td key={i}> {f} </td> ) }
  </tr>);

const AuthorizeDivView = props => (
  props.isAuthed === 'notAuthed' ?
    <div id="authorize-div">
      <span>Authorize access to Google Tasks API</span>
      <button
        id='authorize-button'
        onClick={props.onClick}
      > Authorize </button>
    </div>
  :
    (props.isAuthed === 'authed' ?
      <span> You are Authorized </span>
    :
      <span> Waiting for auth to happen </span>
    )
)

module.exports.TasksApp = TasksApp;
