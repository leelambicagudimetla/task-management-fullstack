const Task = require('../models/Task');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get logged-in user tasks with filtering & pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search, startDate, endDate } = req.query;

    // Filter tasks so users only access their own data
    // (authMiddleware sets req.user from the JWT payload, which is { userId })
    const query = { user: req.user.userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    const numericPage = Number(page);
    const numericLimit = Number(limit);
    const skip = (numericPage - 1) * numericLimit;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit),
      Task.countDocuments(query),
    ]);

    res.json({
      data: tasks,
      meta: {
        total,
        page: numericPage,
        lastPage: Math.ceil(total / numericLimit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST api/tasks
const postTasks = async (req, res) => {
    try {
        const {title,description,status,priority,dueDate,location} = req.body;

        // Only title is actually required by the Task model — everything else,
        // including the attachment, is optional.
        if (!title) {
            return res.status(400).json({
                message: "Title is required..."
            });
        }

        // uploadMiddleware (multer) puts the uploaded file on req.file when the
        // client sends it as multipart/form-data under the "attachment" field.
        let fileUrl;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            fileUrl = result.secure_url;
        }

        const createTask = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            location,
            fileUrl,
            user: req.user.userId
        });

        return res.status(201).json({
            message: "Task Created...",
            task: {
                id: createTask._id,
                title: createTask.title,
                description: createTask.description,
                status: createTask.status,
                priority: createTask.priority,
                dueDate: createTask.dueDate,
                location: createTask.location,
                fileUrl: createTask.fileUrl,
                user: createTask.user
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// PUT api/updateTask
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found..." });
    }

    const { title, description, status, priority, dueDate, location } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || undefined;
    if (location !== undefined) task.location = location;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      task.fileUrl = result.secure_url;
    }

    await task.save();
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE api/deleteTask
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found..." });
    }
    return res.json({ message: "Task deleted..." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, 
  postTasks,
  updateTask,
  deleteTask };