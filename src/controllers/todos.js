module.exports = (db, amqpService, AccessControl, Todo, ApiError) => {
  const controllers = {};

  function isInteger(n) {
    return /^\+?(0|[1-9]\d*)$/.test(n);
  }

  controllers.createTodos = async (req, res, next) => {
    const { uid, username } = req;
    const newTodo = new Todo({ ...req.body, updated_by: username });
    try {
      const todo = await db.insertTodo(newTodo);
      const newAccessControl = new AccessControl({
        todo_id: todo.todo_id,
        user_id: uid,
        role: "creator",
      });
      await db.insertAccessControl(newAccessControl);
      res.status(201).json(todo);
    } catch (error) {
      next(ApiError.internalServerError({ error }));
    }
  };

  controllers.getAllTodos = async (req, res, next) => {
    const { uid } = req;
    try {
      const todos = await db.findAllTodosByUid(uid);
      res.status(200).json(todos);
    } catch (error) {
      next(ApiError.internalServerError({ error }));
    }
  };

  controllers.getTodo = async (req, res, next) => {
    const { uid } = req;
    const todo_id = Number(req.params.todo_id);

    if (!isInteger(todo_id)) {
      next(ApiError.badRequest({ error: `Please provide a valid todo_id` }));
      return
    }

    try {
      const authorised = await db.findAccessControlByTodoidUid(todo_id, uid);

      if (authorised === null) {
        next(
          ApiError.accessControlNotFound({
            error: `User not authorised to access todo_id ${todo_id}`,
          })
        );
        return
      } else {
        try {
          const todo = await db.findTodoByTodoidUid(todo_id, uid);
          const tasks = await db.findTasksByTodoid(todo_id);
          res.json({ ...todo, tasks });
        } catch (error) {
          next(ApiError.internalServerError({ error }));
          return
        }
      }
    } catch (error) {
      next(ApiError.internalServerError({ error }));
    }
  };

  controllers.updateTodo = async (req, res, next) => {
    const { uid, username } = req;
    const todo_id = Number(req.params.todo_id);

    if (!isInteger(todo_id)) {
      next(ApiError.badRequest({ error: `Please provide a valid todo_id` }));
      return
    }

    try {
      const authorised = await db.findAccessControlByTodoidUid(todo_id, uid);
      if (authorised === null || authorised.role === "read-only") {
        next(
          ApiError.accessControlNotFound({
            error: `User not authorised to access todo_id ${todo_id}`,
          })
        );
        return
      } else {
        const { title, due_date, is_completed } = req.body;
        const updatedTodo = new Todo({
          ...req.body,
          todo_id,
          updated_by: username,
        });
        const todo = await db.updateTodo(todo_id, updatedTodo);
        res.status(200).json(todo);
      }
    } catch (error) {
      next(ApiError.internalServerError({ error }));
    }
  };

  controllers.deleteTodo = async (req, res, next) => {
    const { uid } = req;
    const todo_id = Number(req.params.todo_id);

    if (!isInteger(todo_id)) {
      next(ApiError.badRequest({ error: `Please provide a valid todo_id` }));
      return
    }

    try {
      const authorised = await db.findAccessControlByTodoidUid(todo_id, uid);
      if (authorised === null || authorised.role === "read-only") {
        next(
          ApiError.accessControlNotFound({
            error: `User not authorised to access todo_id ${todo_id}`,
          })
        );
        return
      } else {
        let ac = false;
        if (authorised.role === "creator") {
          ac = await db.deleteAccessControlByTodoid(authorised.todo_id);
        }

        if (authorised.role === "collaborator") {
          ac = await db.deleteAccessControl(authorised.access_id);
        }

        const todo = await db.deleteTodo(todo_id);
        todo
          ? res.status(200).json({ access_control_deleted: ac, todo })
          : ApiError.notFound({ error: `Todo_id ${todo_id} not found` });
      }
    } catch (error) {
      next(ApiError.internalServerError({ error }));
    }
  };

  controllers.shareTodo = async (req, res, next) => {
    const { uid } = req;
    const todo_id = Number(req.params.todo_id);
    const { sharelist } = req.body;

    if (!isInteger(todo_id)) {
      next(ApiError.badRequest({ error: `Please provide a valid todo_id` }));
      return
    }

    try {
      const accessCheck = await db.findAccessControlByTodoidUid(todo_id, uid);
      if (!accessCheck) {
        next(
          ApiError.accessControlNotFound({
            error: `User not authorised to access todo_id ${todo_id}`,
          })
        );
        return
      }

      sharelist.forEach(async (item) => {
        await amqpService.publishEmail(item.email, item.role, todo_id);
      });
      res.status(202).json({ status: "accepted", sharelist });
    } catch (error) {
      next(ApiError.internalServerError({ error }));
    }
  };

  return controllers;
};
