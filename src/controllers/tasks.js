module.exports = (db, Task, ApiError) => {
  const controllers = {};

  controllers.createTask = async (req, res, next) => {
    const { uid, username } = req;
    const { title, description, due_date, is_completed } = req.body;
    const todo_id = Number(req.params.todo_id);

    try {
      //check whether uid has access to todo_id to create task
      const authorised = await db.findAccessControlByTodoidUid(todo_id, uid);
      if (authorised === null || authorised.role === "read-only") {
        next(
          ApiError.forbidden({
            error: `User not authorised to access todo_id ${todo_id}`,
          })
        );
      } else {
        const newTask = new Task({
          todo_id,
          title,
          description,
          updated_by: username,
          due_date,
          is_completed,
        });
        const task = await db.insertTask(newTask);
        res.status(201).json(task);
      }
    } catch (error) {
      next(ApiError.internalServerError({ error }));
    }
  };

  controllers.getAllTasks = async (req, res, next) => {
    const { uid } = req;
    try {
      const tasks = await db.findTasksByUid(uid);
      res.status(200).json(tasks);
    } catch (error) {
      next(ApiError.internalServerError({ error }));
    }
  };

  controllers.getTask = async (req, res, next) => {
    const { uid } = req;
    const task_id = Number(req.params.task_id);

    try {
      const task = await db.findTaskByTaskidUid(task_id, uid);
      if (task) {
        res.status(200).json(task);
      } else {
        next(
          ApiError.forbidden({
            error: `User not authorised to access task_id ${task_id}`,
          })
        );
      }
    } catch (error) {
      next(ApiError.internalServerError({ error }));
    }
  };

  controllers.updateTask = async (req, res, next) => {
    const { uid, username } = req;
    const task_id = Number(req.params.task_id);
    const { title, description, due_date, is_completed } = req.body;

    try {
      const task = await db.findTaskById(task_id, uid);
      if (!task) {
        next(
          ApiError.notFound({
            error: `Task_id ${task_id} not found.`,
          })
        );
        
      }

      const { todo_id } = task;
      const authorised = await db.findAccessControlByTodoidUid(todo_id, uid);
      if (authorised === null || authorised.role === "read-only") {
        next(
          ApiError.forbidden({
            error: `User not authorised to access todo_id ${todo_id} (task_id ${task_id})`,
          })
        );
        
      } else {
        const updatedTask = new Task({
          todo_id,
          title,
          description,
          updated_by: username,
          due_date,
          is_completed,
        });
        const task = await db.updateTask(task_id, updatedTask);
        res.status(200).json(task);
      }
    } catch (error) {
      next(ApiError.internalServerError({ error }));
    }
  };

  controllers.deleteTaskBak = async (req, res, next) => {
    const { uid } = req;
    const task_id = Number(req.params.task_id);

    const task = await db.findTaskById(task_id);
    if (task == null) {
      next(
        ApiError.notFound({
          error: `Task_id ${task_id} not found.`,
        })
      );
      
    } else {
      const { todo_id } = task;
      const authorised = await db.findAccessControlByTodoidUid(todo_id, uid);
      if (authorised === null || authorised.role === "read-only") {
        next(
          ApiError.forbidden({
            error: `User not authorised to access todo_id ${todo_id} (task_id ${task_id})`,
          })
        );
        
      } else {
        const todo = await db.deleteTask(task_id);
        res.status(200).json(todo);
      }
    }
  };

  controllers.deleteTask = async (req, res, next) => {
    const { uid } = req;
    const task_id = Number(req.params.task_id);


    try {
      const task = await db.findTaskById(task_id);
      if (!task){
        next(ApiError.notFound(`Task_id ${task_id} not found.`))
      }
      const authorised = await db.findAccessControlByTodoidUid(task.todo_id, uid);
      if (authorised === null || authorised.role === "read-only") {
        next(
          ApiError.forbidden({
            error: `User not authorised to access todo_id ${todo_id}`,
          })
        );
      } else {
        let ac = false;
        if (authorised.role === "creator") {
          ac = await db.deleteAccessControlByTodoid(authorised.todo_id);
        }

        if (authorised.role === "collaborator") {
          ac = await db.deleteAccessControl(authorised.access_id);
        }

        const task = await db.deleteTask(task_id);
        task
          ? res.status(200).json({ access_control_deleted: ac, task })
          : next(ApiError.notFound({ error: `Todo_id ${task_id} not found` }));
      }
    } catch (error) {
      next(ApiError.internalServerError({ error }));
    }
  };

  return controllers;
};
