import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
  makeStyles,
  Checkbox,
} from "@material-ui/core";
import TaskViewModal from "../components/TaskViewModal";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  tableContainer: {
    maxWidth: 1200,
    width: "100%",
  },
  createTaskButton: {
    marginBottom: theme.spacing(2),
  },
}));

const TodoList = ({ token }) => {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://demo2.z-bit.ee/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSaveEditTask = async () => {
    try {
      if (!selectedTask) return;
      const response = await axios.put(
        `https://demo2.z-bit.ee/tasks/${selectedTask.id}`,
        {
          title: taskName,
          marked_as_done: selectedTask.marked_as_done,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedTask = { ...selectedTask, title: response.data.title };
      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
    setTaskName("");
    setTaskDescription("");
  };

  const handleCreateTask = async () => {
    try {
      const response = await axios.post(
        "https://demo2.z-bit.ee/tasks",
        {
          title: taskName,
          desc: taskDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      handleCloseDialog();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleCheckboxChange = async (taskId, checked) => {
    try {
      const response = await axios.put(
        `https://demo2.z-bit.ee/tasks/${taskId}`,
        {
          marked_as_done: checked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedTask = {
        ...tasks.find((task) => task.id === taskId),
        marked_as_done: checked,
      };
      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskName(task.title);
    setTaskDescription(task.desc);
    setOpenDialog(true);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`https://demo2.z-bit.ee/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  return (
    <div className={classes.container}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Done</TableCell>
              <TableCell>Task Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={task.marked_as_done}
                    onChange={(e) =>
                      handleCheckboxChange(task.id, e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.desc}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleEditTask(task)}>
                    Edit
                  </Button>
                  <Button color="primary" onClick={() => handleViewTask(task)}>
                    View
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        className={classes.createTaskButton}
      >
        Create Task
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedTask ? "Edit Task" : "Create New Task"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Name"
            fullWidth
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          {!selectedTask && (
            <TextField
              autoFocus
              margin="dense"
              label="Task Description"
              fullWidth
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          {selectedTask ? (
            <Button onClick={handleSaveEditTask} color="primary">
              Save
            </Button>
          ) : (
            <Button onClick={handleCreateTask} color="primary">
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <TaskViewModal
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        task={selectedTask}
      />
    </div>
  );
};

export default TodoList;
