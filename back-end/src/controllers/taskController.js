const pool = require("../db");
const { doneTask } = require("../utils/emailService");

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const userId = req.user.id;

    const task = await pool.query(
      `INSERT INTO tasks (user_id, title, description, deadline)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, title, description, deadline]
    );

    res.json({ message: "Task berhasil dibuat", task: task.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY deadline ASC",
      [req.user.id]
    );
    res.json(tasks.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (task.rowCount === 0)
      return res.status(404).json({ message: "Task tidak ditemukan" });

    res.json(task.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateTask= async (req, res)=> {
  try {
    const {title, description, deadline}= req.body;
    const taskId= req.params.id;

    const task = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, req.user.id]
    );
    if (task.rowCount === 0)
      return res.status(404).json({ message: "Task tidak ditemukan" });

    await pool.query(`
    UPDATE tasks SET title = $1, description= $2, deadline= $3, reminded= false, expired_notified= false, updated_at= NOW() WHERE id= $4`,
    [title, description, deadline, taskId]);

    res.json({ message: "Task diperbarui" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.updateTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await pool.query(
      `SELECT t.*, u.email FROM tasks t
      JOIN users u ON u.id = t.user_id
      WHERE t.id= $1 AND t.user_id= $2`,
      [taskId, req.user.id]
    );
    if (task.rowCount === 0)
      return res.status(404).json({ message: "Task tidak ditemukan" });

    await pool.query(
      "UPDATE tasks SET status = 'done', updated_at = NOW() WHERE id = $1",
      [taskId]
    );

    await doneTask(task.rows[0].email, task.rows[0].title);

    res.json({ message: "Task telah diselesaikan! Sistem mengirimkan selamat, lewat email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user.id]
    );

    if (task.rowCount === 0)
      return res.status(404).json({ message: "Task tidak ditemukan" });

    res.json({ message: "Task berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
