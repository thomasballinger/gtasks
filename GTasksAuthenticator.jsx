const React = require('react');

/** sets up gtasks api */
class TasksAppAuthenticator extends React.Component {
  constructor(props){
    super(props);
    var gapi;
    var authState = 'dunnoYet';
    if (typeof window['gapi'] !== 'undefined'){
      this.onGoogleScriptLoaded();
    } else if (typeof window['gapiRequested'] !== 'undefined'){
      window.gapiRequested.push(this.onGoogleScriptLoaded.bind(this));
    } else {
      window.gapiRequested = [this.onGoogleScriptLoaded.bind(this)];
      var s = document.createElement( 'script' );
      s.setAttribute('src', "https://apis.google.com/js/client.js?onload=onGapiLoad");
      window.onGapiLoad = () => {
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
    />);
  }

  // Initialization, loading Google Tasks api
  onGoogleScriptLoaded() {
    gapi.auth.authorize(
      {
        'client_id': this.props.client_id,
        'scope': this.props.scopes.join(' '),
        'immediate': true
      }, this.handleAuthResult.bind(this));
  }
  onAuthClick(){
    gapi.auth.authorize(
      {client_id: this.props.client_id,
       scope: this.props.scopes,
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


module.exports.TasksAppAuthenticator = TasksAppAuthenticator;
