const React = require('react');
const auth = require('./auth');

class TasksApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      taskLists: [{title: 'abc', updated: 'never'}],
      authState: 'dunnoYet'
    };
    console.log('constructor running, new state');
  }
  render() {
    return (<div>
      <TaskListsView taskLists={this.state.taskLists}></TaskListsView>
      <AuthorizeDivView
        isAuthed={this.state.authState}
        onClick={this.onAuthClick.bind(this)}
      />
    </div>);
  }

  componentWillReceiveProps(nextProps){
    console.log('new props!', this.props.gapiLoaded, nextProps.gapiLoaded);
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
      <List data={props.taskLists.map( l => l.title + ' updated ' + Math.round((new Date() - l.updated) / 1000) + ' seconds ago')}></List>
      <Table headers={['title', 'ago']} data={props.taskLists.map( l => { return {'title': l.title, 'ago': Math.round((new Date() - l.updated) / 1000) + ' seconds ago'}; } )}> </Table>
      </div>)
    :
      <h1 key="header"> "No task lists or still loading" </h1>)

const ListItem = props => <li> { props.data.toString() } </li>;
const List = props => <ul className="hello"> { props.data.map( d => <ListItem data={d}></ListItem> ) } </ul>
const Table = props => {
  const dataRows = props.data.map( d => props.headers.map( h => d[h] ) );
  return (<table>
    {[].concat([ <TableHeaders headers={props.headers}></TableHeaders> ], dataRows.map( (dataRow) => TableRow({fields: dataRow}) ))}
  </table>);
};
const TableHeaders = props => (<tr>
   { props.headers.map( h => <th>{h}</th> ) }
  </tr>);
const TableRow = props => (<tr>
   { props.fields.map( f => <td> {f} </td> ) }
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
