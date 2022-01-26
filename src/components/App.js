import React, { Component } from "react";
import shortid from "shortid";
import TaskEditor from "./TaskEditor/TaskEditor";
import TaskList from "./TaskList/TaskList";
import TaskFilter from "./TaskFilter/TaskFilter";
import Priority from "../utils/Priority";


const containerStyles = {
  maxWidth: 1200,
  minWidth: 800,
  marginLeft: "auto",
  marginRight: "auto",
};
const filterTasks = (tasks, filter) => {
  return tasks.filter(task =>
    task.text.toLowerCase().includes(filter.toLowerCase()));
};

export default class App extends Component {
  state = {
    tasks: [],
    filter: "",
  };
  componentDidMount() {
    const fromLS=localStorage.getItem('tasks')
    if(fromLS){
      const tasks=JSON.parse(fromLS)
      console.log(tasks)
      this.setState({
        tasks
      })
    }
    // console.log(fromLS)
  }
  componentDidUpdate(prevState){
    if(prevState.tasks !==this.state.tasks){
      localStorage.setItem('tasks', JSON.stringify(this.state.tasks))
    }
  }
  
  changeFilter = (e) => {
    this.setState({ filter: e.target.value });
  };
  addTask = (task) => {
    const taskToAdd = {
      ...task,
      id: shortid.generate(),
      completed: false,
    };
    this.setState((state) => ({
      tasks: [...state.tasks, taskToAdd],
    }));
  };
  deleteTask = (id) => {
    this.setState((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  };
  updateCompleted = (id) => {
    this.setState((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  };
  updatePriority = (id, priority) => {
    this.setState((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, priority } : task
      ),
    }));
  };

  render() {
    const { tasks, filter } = this.state;
    const filteredTasks=filterTasks(tasks, filter)

    return (
      <div style={containerStyles}>
        <TaskEditor onAddTask={this.addTask} />
        <hr />
        <TaskFilter value={filter} onChangeFilter={this.changeFilter} />
        <TaskList
          items={filteredTasks}
          onDeleteTask={this.deleteTask}
          onUpdateCompleted={this.updateCompleted}
          onUpdatePriority={this.updatePriority}
        />
      </div>
    );
  }
}
