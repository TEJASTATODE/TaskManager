const Task = require('../models/Tasks');
const router = require('express').Router();
const {requireAuth} = require('../middleware/Auth');


router.use(requireAuth); 


router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = new Task({
      userId: req.user.id, 
      title,
      description
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    console.log('Editing task id:', req.params.id);
    console.log('Request body:', req.body);
    console.log('User:', req.user);

    const { title, description } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });


    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You cannot edit this task' });
    }

   
    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();

    res.json(task); 
  } catch (err) {
    console.error('Toggle Error:', err);
    res.status(500).json({ error: 'Server error while toggling task' });
  }
});


module.exports = router;
