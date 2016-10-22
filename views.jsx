const React = require('react');
const auth = require('./auth');

/** sets up gtasks api */
class TasksAppAuthenticator extends React.Component {
  constructor(props){
    super(props);
    var gapi;
    var authState = 'dunnoYet';
    if (typeof window['gapi'] !== 'undefined'){
      console.log('gapi already loaded!', gapi);
      this.onGoogleScriptLoaded();
    } else if (typeof window['gapiRequested'] !== 'undefined'){
      console.log('gapi alread scheduled to be loaded:', gapiRequested);
      window.gapiRequested.push(this.onGoogleScriptLoaded.bind(this));
    } else {
      window.gapiRequested = [this.onGoogleScriptLoaded.bind(this)];
      console.log("gapi not loaded or scheduled, let's schedule it:", gapiRequested);
      var s = document.createElement( 'script' );
      s.setAttribute('src', "https://apis.google.com/js/client.js?onload=onGapiLoad");
      window.onGapiLoad = () => {
        console.log('calling callbacks:', window.gapiRequested);
        window.gapiRequested.forEach(cb => cb());
      };
      document.body.appendChild(s);
    }

    this.state = {
      authState: 'dunnoYet'
    }
  }
  render() {
    return (<AuthorizeDivView
      isAuthed={this.state.authState}
      onClick={this.onAuthClick.bind(this)}
    />)
  }

  // Initialization, loading Google Tasks api
  onGoogleScriptLoaded() {
    console.log("value of this:", this);
    console.log("we think it was loaded...", window.gapi.auth, window.gapi);
    gapi.auth.authorize(
      {
        'client_id': auth.CLIENT_ID,
        'scope': auth.SCOPES.join(' '),
        'immediate': true
      }, this.handleAuthResult.bind(this));
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
      gapi.client.load('tasks', 'v1', ()=>this.props.onTasksApiLoaded(gapi.client.tasks));
    } else {
      this.setState({authState: 'notAuthed'})
    }
  };
}

class TaskListApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tasksApi: undefined
    }
  }
  render() {
    return (<div>
      <TasksAppAuthenticator onTasksApiLoaded={this.onTasksApiLoaded.bind(this)}/>
      {this.state.tasksApi ? 'yay' : 'waiting...'}
    </div>)
  }
  onTasksApiLoaded(api){
    this.setState({tasksApi: api})
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
  render() {
    return (<div>
      <TaskListsView taskLists={this.state.taskLists} tasks={this.state.tasks}/>
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

  onTaskApiLoaded(){
    this.getTaskLists();
  }
  getTaskLists(){
    gapi.client.tasks.tasklists.list({ 'maxResults': 10 })
      .execute( (resp) => this.taskListsLoaded(resp.items) );
  }
  taskListsLoaded(taskLists){
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

  // Initialization, loading Google Tasks api
  onGoogleScriptLoaded() {
    gapi.auth.authorize(
      {
        'client_id': auth.CLIENT_ID,
        'scope': auth.SCOPES.join(' '),
        'immediate': true
      }, this.handleAuthResult.bind(this));
  }
  onAuthClick(){
    console.log('trying to auth...', auth.CLIENT_ID, auth.SCOPES);
    gapi.auth.authorize(
      {client_id: auth.CLIENT_ID,
       scope: auth.SCOPES,
       immediate: false
      }, this.handleAuthResult.bind(this));
  }
  handleAuthResult(result) {
    if (result && !result.error) {
      this.setState({authState: 'authed'})
      gapi.client.load('tasks', 'v1', ()=>this.onTaskApiLoaded());
    } else {
      this.setState({authState: 'notAuthed'})
    }
  };
}


const sorted = (arr, key, reverse) => {
  if (reverse === undefined){ reverse = false; }
  const withIndices = arr.map(v => [key(v), v]);
  if (reverse){
    withIndices.sort( (a, b) => b[0] - a[0])
  } else {
    withIndices.sort( (a, b) => a[0] - b[0])
  }
  return withIndices.map(pair => pair[1]);
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

const TaskTable = props => (
  <table>
    <tbody>
      <TableHeaders headers={['title', 'status']}/>
      {props.tasks.map( t => <TableRow fields={[t.title, t.status]} key={t.id}/> )}
    </tbody>
  </table>);

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
module.exports.TaskListApp = TaskListApp;
module.exports.TasksAppAuthenticator = TasksAppAuthenticator;


(function testSorted(){
  const arrayEquals = (a, b) => {
    if (a.length !== b.length){ return false; }
    for (var i = 0; i < a.length; i++){
      if (a[i] !== b[i]){ return false; }
    }
    return true;
  }
  const assertEqual = (a, b, msg) => {
    if (msg === undefined){
      msg = 'not equal';
    }
    if (Array.isArray(a) && Array.isArray(b)){
      if (arrayEquals(a, b)){
        return true;
      }
    } else {
      if (a === b){
        return true;
      }
    }
    console.log(msg, a, b);
    throw Error(msg+': '+a+b);
  }
  assertEqual(1, 1);
  var working = false;
  try {
    assertEqual(['a', 'b'], ['a', 'c']);
  } catch (e){
    working = true;
  }
  if (!working){
    throw "assertEquals doens't work";
  }

  const orig = ['asdf', 'z', 'qwqwe', 'cv', 'wer'];
  const copy = orig.slice();
  const after = sorted(orig, (x)=>x.length);

  assertEqual(after, ['z', 'cv', 'wer', 'asdf', 'qwqwe']);
  assertEqual(after, ['z', 'cv', 'wer', 'asdf', 'qwqwe']);

})();
