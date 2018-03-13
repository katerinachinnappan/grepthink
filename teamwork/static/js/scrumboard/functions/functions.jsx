import type {Task, TaskMap} from "../primatives/types";
import type {DraggableLocation} from "react-beautiful-dnd/lib/types";
import {TaskUpdate} from "../primatives/types";
import {boardID, csrfmiddlewaretoken, getColumnByName, JSONColumns} from "../data";

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
  const post_data = {
    'csrfmiddlewaretoken': csrfmiddlewaretoken,
    'board_id': boardID
  };
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
    let tasksOrdered = Object.keys(reordered).reduce((p, c) => ({...p, ...{[c]: reordered[c].pk}}), {});
    post_data['tasks'] = Object.values(tasksOrdered);
    $.ajax({
      url: '/scrumboard/updateTaskIndexSameColumn/',
      data: post_data,
      dataType: 'json',
      type: "POST",
      success: function (res) {
      },
      error: function (res) {
      }
    });
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

  let newColumnID = getColumnByName(destination.droppableId);
  let oldColTasksOrdered = Object.keys(current).reduce((p, c) => ({...p, ...{[c]: current[c].pk}}), {});
  let newColTasksOrdered = Object.keys(next).reduce((p, c) => ({...p, ...{[c]: next[c].pk}}), {});
  let changedTaskID = target.pk;
  post_data['newColumnID'] = newColumnID;
  post_data['oldColTasksOrdered'] = Object.values(oldColTasksOrdered);
  post_data['newColTasksOrdered'] = Object.values(newColTasksOrdered);
  post_data['changedTaskID'] = changedTaskID;

  $.ajax({
    url: '/scrumboard/updateTaskIndexDifferentColumn/',
    data: post_data,
    dataType: 'json',
    type: "POST",
    success: function (res) {
    },
    error: function (res) {
    }
  });
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


export const addTaskToTaskMap = (taskMap, columnID): TaskMapResult => {
  const current: Task[] = [...taskMap[columnID]];
  let task;
  const post_data = {
    'csrfmiddlewaretoken': csrfmiddlewaretoken,
    'board_id': boardID,
    'col_id': getColumnByName(columnID),
    'index': current.length
  };

  $.ajax({
    url: '/scrumboard/addTask/',
    data: post_data,
    dataType: 'json',
    type: "POST",
    async: false, //TODO change from async
    success: function (res) {
      task = res;
    },
    error: function (res) {
    }
  });

  task = JSON.parse(task.task)[0];
  current.push(task);

  const result: TaskMap = {
    ...taskMap,
    [columnID]: current,
  };

  return {
    taskMap: result,
    autoFocusTaskId: task.pk,
  };
};

export const addColumnToTaskMap = (taskMap, columnID, keys): TaskMapResult => {
  let column;

  const post_data = {
    'csrfmiddlewaretoken': csrfmiddlewaretoken,
    'board_id': boardID,
    'index': keys.length,
    'title': columnID
  };

  $.ajax({
    url: '/scrumboard/addColumn/',
    data: post_data,
    dataType: 'json',
    type: "POST",
    async: false, //TODO change from async
    success: function (res) {
      column = res;
    },
    error: function (res) {
    }
  });

  column = JSON.parse(column.column)[0];
  JSONColumns.push(column);
  const result: TaskMap = {
    ...taskMap,
    [column.fields.title]: [],
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

  const post_data = {
    'csrfmiddlewaretoken': csrfmiddlewaretoken,
    'col_id': getColumnByName(oldName),
    'title': newName
  };

  $.ajax({
    url: '/scrumboard/updateColumn/',
    data: post_data,
    dataType: 'json',
    type: "POST",
    success: function (res) {
    },
    error: function (res) {
    }
  });


  return {
    taskMap: taskMap,
    keys: keys,
  };
};


export const deleteColumn = (colName, taskMap, keys): void => {
  let index = keys.indexOf(colName);
  let columnID = getColumnByName(colName);
  const post_data = {
    'csrfmiddlewaretoken': csrfmiddlewaretoken,
    'column_id': columnID,
  };
  $.ajax({
    url: '/scrumboard/deleteColumn/',
    data: post_data,
    dataType: 'json',
    type: "POST",
    success: function (res) {
    },
    error: function (res) {
    }
  });

  delete taskMap[colName];
  keys.splice(index, 1);
  return {
    taskMap: taskMap,
    keys: keys,
  };
};


export const updateTask = (colID, taskID, taskMap, taskUpdate: TaskUpdate): Task => {
  const post_data = {
    'csrfmiddlewaretoken': csrfmiddlewaretoken,
    'task_id': taskUpdate.task.pk,
  };
  if (taskUpdate.title) {
    taskUpdate.task.fields.title = taskUpdate.title;
    post_data['title'] = taskUpdate.title;
  }
  if (taskUpdate.desc) {
    taskUpdate.task.fields.description = taskUpdate.desc;
    post_data['desc'] = taskUpdate.desc;
  }
  if (taskUpdate.members) {
    taskUpdate.task.fields.members = taskUpdate.members;
    post_data['members'] = taskUpdate.members.reduce((x, y) => {
      x.push(y.value);
      return x
    }, []);
  }
  if (taskUpdate.colour) {
    taskUpdate.task.fields.colour = taskUpdate.colour;
    post_data['colour'] = taskUpdate.colour;
  }
  $.ajax({
    url: '/scrumboard/updateTask/',
    data: post_data,
    dataType: 'json',
    type: "POST",
    success: function (res) {
    },
    error: function (res) {
    }
  });

  const current: Task[] = [...taskMap[colID]];
  let task = current[taskID];
  current.splice(task.fields.index, 1, taskUpdate.task);

  const result: TaskMap = {
    ...taskMap,
    [colID]: current,
  };
  return {
    taskMap: result,
    autoFocusTaskId: null,
  };

};


export const deleteTask = (colID, taskID, taskMap): TaskMapResult => {
  const current: Task[] = [...taskMap[colID]];
  let task = current[taskID];
  current.splice(taskID, 1);
  const post_data = {
    'csrfmiddlewaretoken': csrfmiddlewaretoken,
    'task_id': task.pk,
  };
  $.ajax({
    url: '/scrumboard/deleteTask/',
    data: post_data,
    dataType: 'json',
    type: "POST",
    success: function (res) {
    },
    error: function (res) {
    }
  });

  const result: TaskMap = {
    ...taskMap,
    [colID]: current,
  };

  return {
    taskMap: result,
    autoFocusTaskId: null,
  };
};

export const exportBoard = (itemMapVals): [[]] => {
  let lengths = itemMapVals.map(function (a) {
    return a.length;
  });
  return itemMapVals[lengths.indexOf(Math.max.apply(Math, lengths))].map((col, c) => itemMapVals.map((row, r) => itemMapVals[r][c] === undefined ?
    "":itemMapVals[r][c].fields.title));
};


