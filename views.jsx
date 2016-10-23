const React = require('react');
const auth = require('./auth');
const TasksAppAuthenticator = require('./GTasksAuthenticator').TasksAppAuthenticator;
const sorted = require('./util').sorted;

class TaskListApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tasks: [],
      api: undefined
    }
  }
  render() {
    return (<div>
      <TasksAppAuthenticator
        onTasksApiLoaded={this.onTasksApiLoaded.bind(this)}
        client_id={auth.CLIENT_ID}
        scopes={auth.SCOPES}
        />
      <TaskTable tasks={this.state.tasks} />
    </div>)
  }
  onTasksApiLoaded(api){
    this.setState({api: api})
    api.tasks.list({
      'tasklist': this.props.tasklistId,
      'maxResults': this.props.maxResults
    }).execute( resp => this.setState({tasks: resp.items}));
    //https://developers.google.com/google-apps/tasks/v1/reference/tasks/list
  }
}
TaskListApp.defaultProps = {
  maxResults: 20
}


class SingleTaskDisplay extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tasks: [],
      api: undefined
    }
  }
  render() {
    return (<span>
      <TasksAppAuthenticator
        onTasksApiLoaded={this.onTasksApiLoaded.bind(this)}
        client_id={auth.CLIENT_ID}
        scopes={auth.SCOPES}
        />
      {this.state.tasks.length ? this.state.tasks[0].title : (this.props.defaultContent || '?')}
    </span>)
  }
  onTasksApiLoaded(api){
    this.setState({api: api})
    api.tasks.list({
      'tasklist': this.props.tasklistId,
      'maxResults': 1
    }).execute( resp => this.setState({tasks: resp.items}));
    //https://developers.google.com/google-apps/tasks/v1/reference/tasks/list
  }

}


class TasksApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      taskLists: [{title: 'abc', updated: 'never', id: '123123'}],
      tasks: {}, // This'll be a mapping of tasklist id to tasks objects
      authState: 'dunnoYet'
    };
  }
  render(props) {
    return (<div>
      <TaskListsView taskLists={this.state.taskLists} tasks={this.state.tasks}/>
      <TasksAppAuthenticator
        onTasksApiLoaded={this.onTasksApiLoaded.bind(this)}
        client_id={auth.CLIENT_ID}
        scopes={auth.SCOPES}
        />
    </div>);
  }

  componentWillReceiveProps(nextProps){
    if (!this.props.gapiLoaded && nextProps.gapiLoaded){
      this.onGoogleScriptLoaded();
    }
  }

  onTasksApiLoaded(){
    this.getTaskLists();
  }
  getTaskLists(){
    gapi.client.tasks.tasklists.list({ 'maxResults': 10 })
      .execute( (resp) => this.taskListsLoaded(resp.items) );
  }
  taskListsLoaded(taskLists){
    console.log(taskLists);
    this.setState({taskLists: taskLists ? taskLists.map( (taskList) => {
      taskList.updated = Date.parse(taskList.updated);
      return taskList;
    }) : []});
    taskLists.forEach( taskList => this.getTasks(taskList) )
  }

  getTasks(taskList){
    gapi.client.tasks.tasks.list({ 'tasklist': taskList.id })
      .execute( resp => this.tasksLoaded(resp.items, taskList));
  }
  tasksLoaded(items, taskList){
    this.setState((prevState, props)=>{
      prevState.tasks[taskList.id] = items; // ugh mutation
      return {tasks: prevState.tasks};
    });
  }
}


const TaskListsView = props => (
  props.taskLists ?
    (<div>
      <h1> Task Lists: </h1>
      <List data={ props.taskLists.map( l => ({
        data: l.title + ' updated ' + Math.round((new Date() - l.updated) / 1000) + ' seconds ago',
        key: l.id
      }))}/>
      { sorted(props.taskLists, t=>Date.parse(t.updated), true).map( taskList => (
         <div key={taskList.id}>
          <TaskTable tasks={props.tasks[taskList.id] || []}/>
          <h2> {taskList.title} </h2>
        </div>
        ))
      }
      </div>)
    :
      <h1 key="header"> "No task lists or still loading" </h1>)

const sigil = (s) => s === 'needsAction' ? '☐' : '☑';

const TaskTable = props => {
  return (<table>
    <tbody>
      {props.tasks.map( t => <TableRow fields={[sigil(t.status), t.title]} key={t.id}/> )}
    </tbody>
  </table>);
}

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

module.exports.TasksApp = TasksApp;
module.exports.TaskListApp = TaskListApp;
module.exports.SingleTaskDisplay = SingleTaskDisplay;
module.exports.TasksAppAuthenticator = TasksAppAuthenticator;
