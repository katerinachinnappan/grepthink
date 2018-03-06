import type {Column, Task, TaskMap} from "./primatives/types";

const JSONColumns = JSON.parse(server_data.columns);
const JSONTasks = JSON.parse(server_data.tasks);


const getTasksByID = (column: Column, items: Task[]): Task[] =>
  items.filter((task: Task) => task.fields.column === column.pk);


export let itemMap: TaskMap =
  JSONColumns.reduce((previous: TaskMap, column: Column) => ({
    ...previous, [column.fields.title]: getTasksByID(column, JSONTasks),
  }), {});


//Find out what coloumn we are in and then add a new task to that coloumn
