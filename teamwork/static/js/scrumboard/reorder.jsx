import type {Task, TaskMap} from "./primatives/types";
import type {DraggableLocation} from "react-beautiful-dnd/lib/types";

const reorder = (
  list: any[],
  startIndex: number,
  endIndex: number): any[] => {
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

export type ReorderTaskMapResult = {|
  taskMap: TaskMap,
  autoFocusQuoteId: ?string,
|}

export const reorderQuoteMap = ({
  taskMap,
  source,
  destination,
}: ReorderTaskMapArgs): ReorderTaskMapResult => {
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
      autoFocusQuoteId: null,
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
    autoFocusQuoteId: target.id,
  };
};
