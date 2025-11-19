const cron= require("node-cron");
const pool= require("../db");
const {expiredTask, reminderTask}= require("../utils/emailService");

cron.schedule("*/5 * * * *", async () => {

  try {
    // Handle reminder tasks
    const reminderResult = await pool.query(`
      SELECT tasks.id, tasks.title, tasks.deadline, users.email
      FROM tasks
      JOIN users ON users.id = tasks.user_id
      WHERE tasks.deadline <= NOW() + INTERVAL '1 day'
        AND tasks.deadline > NOW()
        AND tasks.reminded = FALSE
        AND tasks.status NOT IN ('done','expired')
    `);

    for (const task of reminderResult.rows) {
      const formattedDeadline = new Date(task.deadline).toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      await reminderTask(task.email, task.title, formattedDeadline);
      await pool.query(`UPDATE tasks SET reminded = TRUE WHERE id = $1`, [
        task.id
      ]);

      console.log(`Reminder sent for task: ${task.title}`);
    }

    // Handle expired tasks
    const expiredResult = await pool.query(`
      SELECT tasks.id, tasks.title, tasks.deadline, users.email
      FROM tasks
      JOIN users ON users.id = tasks.user_id
      WHERE tasks.deadline < NOW()
        AND tasks.status NOT IN ('done','expired')
    `);

    for (const task of expiredResult.rows) {
      await expiredTask(task.email, task.title, task.deadline);
      await pool.query(
        `UPDATE tasks SET status = 'expired', expired_notified = TRUE WHERE id = $1`,
        [task.id]
      );
      console.log(`Expired notification sent for task: ${task.title}`);
    }

  } catch (err) {
    console.error("Cron job error:", err);
  }
});
