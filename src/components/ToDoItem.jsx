import React from "react";

function TodoItem(props) {
  return (
    <div
      className="flex justify-between items-center p-4 shadow-md"
      draggable
      onDragStart={() => {
        props.dragItem.current = props.order;
      }}
      onDragEnter={() => {
        props.dragOverItem.current = props.order;
      }}
      onDragEnd={() => {
        props.handleDragging();
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      {props.check ? (
        <div className="text-lg font-semibold text-gray-300 line-through">
          {props.content}
        </div>
      ) : (
        <div className="text-lg font-semibold text-[green]">
          {props.content}
        </div>
      )}

      <div className="flex items-center gap-2 ">
        <button onClick={() => props.handleCheck(props.id)}>
          {props.check ? (
            <img
              src="/todolist/x.svg"
              alt="x-icon"
              className="h-[24px] w-[24px]"
            />
          ) : (
            <img
              src="/todolist/tick.svg"
              alt="tick-icon"
              className="h-[24px] w-[24px]"
            />
          )}
        </button>
        <button>
          <img
            src="/todolist/bin.svg"
            alt="bin-icon"
            className="h-[24px] w-[24px]"
            onClick={() => {
              props.handleDelete(props.id);
            }}
          />
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
