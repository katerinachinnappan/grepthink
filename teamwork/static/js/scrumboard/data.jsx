import type {Column, Task, TaskMap} from "./primatives/types";

const JSONColumns = JSON.parse(server_data.columns);
const JSONTasks = JSON.parse(server_data.tasks);
export const boardID =  JSON.parse(server_data.board_id);
export const csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

const getTasksByID = (column: Column, items: Task[]): Task[] =>
  items.filter((task: Task) => task.fields.column === column.pk);


export let itemMap: TaskMap =
  JSONColumns.reduce((previous: TaskMap, column: Column) => ({
    ...previous, [column.fields.title]: getTasksByID(column, JSONTasks),
  }), {});


export const getColumnByName = (colName: string): Column => {
  for (const [key, value] of Object.entries(JSONColumns)) {
    if (value.fields.title === colName)
      return value.pk;
  }
};

