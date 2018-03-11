import type {Column, Task, TaskMap} from "./primatives/types";
import {UserMap} from "./primatives/types";

export const JSONColumns = JSON.parse(server_data.columns);
export const JSONTasks = JSON.parse(server_data.tasks);
export const JSONMembers = JSON.parse(server_data.members);
export const boardID = JSON.parse(server_data.board_id);
export const csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
// export const title = JSON.parse(server_data.title);



const getTasksByID = (column: Column, items: Task[]): Task[] =>
  items.filter((task: Task) => task.fields.column === column.pk);

export const getColumnByName = (colName: string): Column => {
  for (const [key, value] of Object.entries(JSONColumns)) {
    if (value.fields.title === colName)
      return value.pk;
  }
};

export const getUserNameByID = (id: string): string => {
  return result[id];
};

export let itemMap: TaskMap =
  JSONColumns.reduce((previous: TaskMap, column: Column) => ({
    ...previous, [column.fields.title]: getTasksByID(column, JSONTasks),
  }), {});

export let userMap: UserMap =
  JSONMembers.reduce((arr, item) => {
    arr.push({label: item.fields.username, value: item.pk});
    return arr;
  }, []);


let result = JSONMembers.reduce((map, item) => {
    map[item.pk] = item.fields.username;
    return map;
}, {});

