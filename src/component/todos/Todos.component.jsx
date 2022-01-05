import React, { useState } from "react";
import "./Todos.styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";

const item = {
  id: v4(),
  name: "Clean the house",
};

const item2 = {
  id: v4(),
  name: "Wash the car",
};
const item3 = {
  id: v4(),
  name: "Going to market",
};

function Todos() {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [state, setState] = useState({
    todo: {
      title: "Todo",
      items: [item, item2],
    },
    "in-progress": {
      title: "Doing",
      items: [item3],
    },
    done: {
      title: "Done",
      items: [],
    },
  });

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    // Creating a copy of item before removing it from state
    const itemCopy = { ...state[source.droppableId].items[source.index] };

    setState((prev) => {
      prev = { ...prev };
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1);

      // Adding to new items array location
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });
  };

  const addItem = () => {
    setState((prev) => {
      return {
        ...prev,
        todo: {
          title: "Todo",
          items: [
            {
              id: v4(),
              name: text,
              date: date,
              time: time,
            },
            ...prev.todo.items,
          ],
        },
      };
    });
    setTime("");
    setDate("");
    setText("");
  };

  return (
    <div className="container-todo">
      <div className="container-form">
        <h1 className="heading">Todos App</h1>
        <input
          className="add-todo"
          type="text"
          value={text}
          placeholder="Add todos"
          onChange={(e) => setText(e.target.value)}
        />
        <label className="label-date">Deadline</label>
        <input
          className="add-date"
          type="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          className="add-time"
          type="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button className="btn btn-warning" onClick={addItem}>
          Add Todos
        </button>
      </div>
      <div className="todo">
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return (
              <div key={key} className={"column"}>
                <h3>{data.title}</h3>
                <Droppable droppableId={key}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={"droppable-col"}
                      >
                        {data.items.map((el, index) => {
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provided, snapshot) => {
                                console.log(snapshot);
                                return (
                                  <div
                                    className={`item ${
                                      snapshot.isDragging && "dragging"
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <h5>{el.name}</h5>
                                    <h6>Deadline</h6>
                                    <h6> {el.date}</h6>
                                    <h6> {el.time}</h6>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default Todos;
