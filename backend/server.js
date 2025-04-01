import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';

import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getTodos, getTodo, createTodo, deleteCheckedTodos, getNotes, getNote, createNote, updateNote, deleteNote, getComments, getComment, createComment, updateComment, deleteComment, getUsers, getUser, createUser, updateUser, deleteUser } from './database.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

app.use('/auth', authRouter) 

app.get('/', (req, res) => {
    console.log("req.body")
})

//----------------------------------------------
// calendar_event
//----------------------------------------------
app.get("/calendar_event", async (req, res) => {
    try {
        const events = await getEvents();
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching events' });
    }
});

app.get("/calendar_event/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const event = await getEvent(id);
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the event' });
    }
});

app.post("/calendar_event", async (req, res) => {
    try {
        const { title, description, event_date, start_time, end_time } = req.body;
        const event = await createEvent({ title, description, event_date, start_time, end_time });
        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the event' });
    }
});

app.put("/calendar_event/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, event_date, start_time, end_time } = req.body;
        const event = await updateEvent(id, { title, description, event_date, start_time, end_time });
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the event' });
    }
});

app.delete("/calendar_event/:id", async (req, res) => {
    console.log("deleting")
    try {
        const id = req.params.id;
        const event = await deleteEvent(id);
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the event' });
    }
});

//----------------------------------------------
// todo_item
//----------------------------------------------
app.get("/todo_item", async (req, res) => {
    try {
        const items = await getTodos();
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching items' });
    }
});

app.get("/todo_item/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const item = await getTodo(id);
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the item' });
    }
});

app.post("/todo_item", async (req, res) => {
    try {
        const { title, is_checked, start_date, start_time, end_date, end_time, fk_dashboard, fk_app_user } = req.body;
        const item = await createTodo({ title, is_checked, start_date, start_time, end_date, end_time, fk_dashboard, fk_app_user });
        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the item' });
    }
});

app.delete("/todo_item/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const item = await deleteCheckedTodos(id);
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the item' });
    }
});

//----------------------------------------------
// note
//----------------------------------------------
app.get("/note", async (req, res) => {
    try {
        const notes = await getNotes();
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'An error occurred while fetching notes' });
    }
});

app.get("/note/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const note = await getNote(id);
        res.json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ error: 'An error occurred while fetching the note' });
    }
});

app.post("/note", async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await createNote({ title, content });
        res.status(201).json(note);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'An error occurred while creating the note' });
    }
});

app.put("/note/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, content } = req.body;
        const note = await updateNote(id, { title, content });
        res.json(note);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'An error occurred while updating the note' });
    }
});

app.delete("/note/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const note = await deleteNote(id);
        res.json(note);
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'An error occurred while deleting the note' });
    }
});

//----------------------------------------------
// comment
//----------------------------------------------
app.get("/comments", async (req, res) => {
    try {
        const comments = await getComments();
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'An error occurred while fetching comments' });
    }
});

app.get("/comments/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await getComment(id);
        res.json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ error: 'An error occurred while fetching the comment' });
    }
});

app.post("/comments", async (req, res) => {
    try {
        const { content, fk_app_user, fk_calendar_event } = req.body;
        const comment = await createComment({ content, fk_app_user, fk_calendar_event });
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'An error occurred while creating the comment' });
    }
});

app.put("/comments/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { content } = req.body;
        const comment = await updateComment(id, { content });
        res.json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'An error occurred while updating the comment' });
    }
});

app.delete("/comments/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await deleteComment(id);
        res.json(comment);
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'An error occurred while deleting the comment' });
    }
});

//----------------------------------------------
// user
//----------------------------------------------
app.get("/app_user", async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
});

app.get("/app_user/:login_name", async (req, res) => {
    try {
        const login_name = req.params.login_name;
        console.log(`Fetching user with login_name: ${login_name}`); 
        const user = await getUser(login_name);
        if (!user) {
            console.log(`User not found: ${login_name}`);
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occurred while fetching the user' });
    }
});

app.post("/app_user", async (req, res) => {
    try {
        const { login_name, password } = req.body;
        if (!login_name || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const user = await createUser({ login_name, password });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user' });
    }
});

app.put("/app_user/:login_name", async (req, res) => {
    try {
        const login_name = req.params.login_name;
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        const user = await updateUser(login_name, { password });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
});

app.delete("/app_user/:login_name", async (req, res) => {
    try {
        const login_name = req.params.login_name;
        const user = await deleteUser(login_name);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
});


// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(8080, () => {
    console.log('Server is running on port http://localhost:8080');
});

