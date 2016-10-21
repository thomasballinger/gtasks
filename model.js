/* Model */
var model = {
  taskLists : [{title: 'a', updated: 'never'}, {title: 'b', updated: 'recently'}],
              // Each task list has a title, an id, and an updated field: RFC 3339 timestamp
              // https://developers.google.com/google-apps/tasks/v1/reference/tasklists#resource
  authState : 'dunnoYet'   // 'dunnoYet', 'authed', 'notAuthed'
};
module.exports.model = model;
