const express= require('express');
const router= express.Router();
const auth= require('../middlewares/authMiddleware');

const {
    createTask, getTasks, getTaskById, updateTaskStatus, deleteTask, 
    updateTask
}= require('../controllers/taskController');

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.get("/:id", auth, getTaskById);
router.patch("/:id/status", auth, updateTaskStatus);
router.put("/:id/edit", auth, updateTask);
router.delete("/:id", auth, deleteTask);


module.exports= router;