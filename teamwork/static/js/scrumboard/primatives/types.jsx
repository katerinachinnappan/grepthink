import type {DraggableId, DraggableLocation} from "react-beautiful-dnd/lib/types";

export type Task = {|
  fields: {
    assigned: boolean,
    board: number,
    column: number,
    description: string,
    title: string,
    userID: number,
  },
  model: string,
  pk: number,
|}

export type Column = {|
  fields: {
    board: number
    description: string,
    title: string,
  }
  model: string,
  pk: number,
|}


export type TaskMap = {
  [key: string]: Task[]
}

export type Dragging = {|
  id: DraggableId,
  location: DraggableLocation,
|}
