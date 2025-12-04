import React, { useEffect, useState } from "react";
import StaffTaskService from "../services/StaffTaskService";

function StaffDashboard({ staffId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    StaffTaskService.getTasksByStaff(staffId)
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, [staffId]);

  const handleStatusChange = (taskId, newStatus) => {
    StaffTaskService.updateStatus(taskId, newStatus)
      .then(res => {
        setTasks(tasks.map(t => t.taskId === taskId ? res.data : t));
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>My Tasks</h2>
      {tasks.map(task => (
        <div key={task.taskId}>
          <p>{task.taskType} - {task.status}</p>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task.taskId, e.target.value)}
          >
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default StaffDashboard;
