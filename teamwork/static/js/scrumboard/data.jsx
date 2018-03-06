import type {Column, Task, TaskMap} from "./primatives/types";
import {UserMap} from "./primatives/types";

const JSONColumns = JSON.parse(server_data.columns);
const JSONTasks = JSON.parse(server_data.tasks);
const JSONMembers = JSON.parse(server_data.members);
export const boardID = JSON.parse(server_data.board_id);
export const csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

/*

:
fields
:
date_joined
:
"2018-02-01T18:49:22.604Z"
email
:
"hhargr@ucsc.edu"
first_name

username
:
"hhargrea"
__proto__
:
Object
model
:
"auth.user"
pk
:
1
__proto__
:
Object
1
:
{model: "auth.user", pk: 3, fields: {…}}
2
:
{model: "auth.user", pk: 4, fields: {…}}
 */


const getTasksByID = (column: Column, items: Task[]): Task[] =>
  items.filter((task: Task) => task.fields.column === column.pk);


export let itemMap: TaskMap =
  JSONColumns.reduce((previous: TaskMap, column: Column) => ({
    ...previous, [column.fields.title]: getTasksByID(column, JSONTasks),
  }), {});

// export let userMap: UserMap =
//   JSONMembers.reduce((previous: UserMap, item) => ({
//     ...previous, [item.fields.username]: item.fields.username,
//  }), []);

export let userMap: UserMap =
  JSONMembers.reduce((previous, item) => {
    previous.push({ label: item.fields.username, value : item.fields.username})
    return previous;
  }, []);


// const FLAVOURS = [
// 	{ label: 'Chocolate', value: 'chocolate' },
// 	{ label: 'Vanilla', value: 'vanilla' },
// 	{ label: 'Strawberry', value: 'strawberry' },
// 	{ label: 'Caramel', value: 'caramel' },
// 	{ label: 'Cookies and Cream', value: 'cookiescream' },
// 	{ label: 'Peppermint', value: 'peppermint' },
// ];
// console.log(userMap)
// console.log(FLAVOURS)


export const getColumnByName = (colName: string): Column => {
  for (const [key, value] of Object.entries(JSONColumns)) {
    if (value.fields.title === colName)
      return value.pk;
  }
};

