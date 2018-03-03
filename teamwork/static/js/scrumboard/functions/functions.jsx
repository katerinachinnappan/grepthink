import type {Task, TaskMap} from "../primatives/types";
import type {DraggableLocation} from "react-beautiful-dnd/lib/types";

const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default reorder;

type ReorderTaskMapArgs = {|
  taskMap: TaskMap,
  source: DraggableLocation,
  destination: DraggableLocation,
|}

export type TaskMapResult = {|
  taskMap: TaskMap,
  autoFocusTaskId: ?string,
|}

export const reorderTaskMap = ({taskMap, source, destination,}: ReorderTaskMapArgs): TaskMapResult => {
  const current: Task[] = [...taskMap[source.droppableId]];
  const next: Task[] = [...taskMap[destination.droppableId]];
  const target: Task = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered: Task[] = reorder(
      current,
      source.index,
      destination.index,
    );
    const result: TaskMap = {
      ...taskMap,
      [source.droppableId]: reordered,
    };

    return {
      taskMap: result,
      // not auto focusing in own list
      autoFocusTaskId: null,
    };

  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result: TaskMap = {
    ...taskMap,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };
  return {
    taskMap: result,
    autoFocusTaskId: target.pk,
  };
};

let id = 10;

export const addTaskToTaskMap = (taskMap, columnID): TaskMapResult => {
  const current: Task[] = [...taskMap[columnID]];


  const newTask: Task = {
    model: "scrumboard.task",
    pk: id++,
    fields: {
      assigned: true,
      board: 1,
      column: 1,
      description: 'add',
      title: 'add',
      userID: 1,
    },
  };

  current.push(newTask);

  const result: TaskMap = {
    ...taskMap,
    [columnID]: current,
  };

  return {
    taskMap: result,
    autoFocusTaskId: newTask.pk,
  };
};

export const addColumnToTaskMap = (taskMap, columnID): TaskMapResult => {
  const result: TaskMap = {
    ...taskMap,
    [columnID]: [],
  };
  return {
    taskMap: result,
    autoFocusTaskId: null,
  };
};

export const updateColumnName = (oldName, newName, taskMap, keys): void => {
  let index = keys.indexOf(oldName);
  taskMap[newName] = taskMap[oldName];
  delete taskMap[oldName];
  keys.splice(index, 1, newName);
  return {
    taskMap: taskMap,
    keys: keys,
  };
};


export const deleteColumn = (colName, taskMap, keys): void => {
  let index = keys.indexOf(colName);
  delete taskMap[colName];
  keys.splice(index, 1);
  return {
    taskMap: taskMap,
    keys: keys,
  };
};


export const updateTask = (taskId, keys) => {


}


