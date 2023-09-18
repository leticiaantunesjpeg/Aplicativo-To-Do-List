import { onValue, ref, remove, set, update } from "firebase/database";
import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { UserContext } from "../context/UserContext";
import { auth, db } from "../firebase";
import TodoItem from "./ToDoItem";

const ACTIONS = {
  ADD: "add",
  DELETE: "delete",
  CHECK: "check",
  DELETEALL: "delete-all",
  INIT: "init",
  SWAP: "swap",
};

function reducer(todos, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      return [
        ...todos,
        {
          uidd: action.payload.uidd,
          content: action.payload.newTask,
          done: false,
        },
      ];

    case ACTIONS.DELETE:
      return todos.filter((todo) => todo.uidd !== action.payload.delID && todo);
    case ACTIONS.CHECK:
      return todos.map((todo) => {
        return todo.uidd === action.payload.checkID
          ? { ...todo, done: !todo.done }
          : todo;
      });
    case ACTIONS.DELETEALL:
      return [];
    case ACTIONS.INIT:
      return [...todos, action.payload.todoObj];
    case ACTIONS.SWAP:
      const uidDragItem = action.payload.dragItemObj.uidd;
      const uidDragOverItem = action.payload.dragOverItemObj.uidd;
      return todos.map((todo, i) =>
        i === action.payload.dragItem.current
          ? { ...action.payload.dragOverItemObj, uidd: uidDragItem }
          : i === action.payload.dragOverItem.current
          ? { ...action.payload.dragItemObj, uidd: uidDragOverItem }
          : todo
      );

    default:
      return todos;
  }
}

export default function TodoApp() {
  const [todos, dispatch] = useReducer(reducer, []);
  const [newTask, setNewTask] = useState("");
  const navigate = useNavigate();
  const dragItem = useRef(0);
  const dragOverItem = useRef(0);
  const { email } = useContext(UserContext);

  function handleSubmit(e) {
    e.preventDefault();
    const uidd = uid();
    dispatch({ type: ACTIONS.ADD, payload: { newTask: newTask, uidd: uidd } });
    writeToDatabase(uidd);
    setNewTask("");
  }

  function handleDelete(delID) {
    //D - delete
    dispatch({ type: ACTIONS.DELETE, payload: { delID: delID } });
    remove(ref(db, `/${auth.currentUser.uid}/${delID}`));
  }

  function handleCheck(checkID) {
    //U - update
    dispatch({ type: ACTIONS.CHECK, payload: { checkID: checkID } });
    const newTodo = todos.filter((todo) => {
      return todo.uidd === checkID;
    });
    const done = newTodo[0].done;
    update(ref(db, `/${auth.currentUser.uid}/${checkID}`), {
      ...newTodo,
      done: !done,
    });
  }

  function handleDragging() {
    const dragItemObj = todos[dragItem.current];
    const dragOverItemObj = todos[dragOverItem.current];
    dispatch({
      type: ACTIONS.SWAP,
      payload: {
        dragItem,
        dragOverItem,
        dragItemObj,
        dragOverItemObj,
      },
    });
  }

  function handleLogOut() {
    auth
      .signOut()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      } else {
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          dispatch({ type: ACTIONS.DELETEALL });
          const data = snapshot.val();
          if (data) {
            //R - read
            Object.values(data).map((todoObj) => {
              dispatch({ type: ACTIONS.INIT, payload: { todoObj: todoObj } });
            });
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    todos.forEach((todo) => {
      set(ref(db, `${auth.currentUser.uid}/${todo.uidd}`), { ...todo });
    });
  }, [todos]);

  const writeToDatabase = (uidd) => {
    //C - create
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      uidd: uidd,
      content: newTask,
      done: false,
    });
  };

  return (
    <div className="w-[400px] shadow-xl rounded-xl relative">
      <h1 className="text-xl font-bold bg-[green] text-white text-center py-4 rounded-t-xl">
        Todo List
      </h1>
      <span
        onClick={handleLogOut}
        className="absolute top-[-60px] right-0 rounded-xl p-2 bg-gray-300 shadow-md hover:bg-[red] cursor-pointer text-white font-semibold text-lg"
      >
        Sair
      </span>
      <form action="" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Descreva suas atividades"
          className="bg-transparent w-full shadow-md p-4 focus:outline-none"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
      </form>
      <div>
        {todos.map((task, i) => (
          <TodoItem
            key={task.uidd}
            content={task.content}
            handleDelete={handleDelete}
            handleCheck={handleCheck}
            id={task.uidd}
            check={task.done}
            order={i}
            handleDragging={handleDragging}
            dragItem={dragItem}
            dragOverItem={dragOverItem}
          />
        ))}
      </div>
    </div>
  );
}
