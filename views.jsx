/* Views */

const view = (state) => (<div>
    <TaskListsView taskLists={state.taskLists}></TaskListsView>
    <AuthorizeDivView isAuthed={state.authState}></AuthorizeDivView>
  </div>)

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
        onClick={() => [update('authClick'), false][1]}
      > Authorize </button>
    </div>
  :
    <span> You are Authorized </span>
)

module.exports.view = view;
