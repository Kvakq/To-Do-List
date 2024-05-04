import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";

const TaskViewModal = ({ open, onClose, task }) => {
  return (
    task && (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Title: {task.title}</Typography>
          <Typography variant="body1">Description: {task.desc}</Typography>
          <Typography variant="body1">Created At: {task.created_at}</Typography>
          <Typography variant="body1">
            Marked as Done: {task.marked_as_done ? "Yes" : "No"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
};

export default TaskViewModal;
