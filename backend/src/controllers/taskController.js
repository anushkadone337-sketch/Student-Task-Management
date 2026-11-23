const Task = require("../models/Task");

const allowedStatuses = ["Pending", "In Progress", "Completed"];
const allowedPriorities = ["Low", "Medium", "High"];

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description = "", status = "Pending", priority = "Medium", dueDate = null } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Please enter a task title." });
    }
    if (!allowedStatuses.includes(status) || !allowedPriorities.includes(priority)) {
      return res.status(400).json({ success: false, message: "Invalid task status or priority." });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      dueDate: dueDate || null
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const updates = {};
    ["title", "description", "status", "priority", "dueDate"].forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    if (updates.status && !allowedStatuses.includes(updates.status)) {
      return res.status(400).json({ success: false, message: "Invalid task status." });
    }
    if (updates.priority && !allowedPriorities.includes(updates.priority)) {
      return res.status(400).json({ success: false, message: "Invalid task priority." });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.json({ success: true, message: "Task deleted successfully." });
  } catch (error) {
    next(error);
  }
};
