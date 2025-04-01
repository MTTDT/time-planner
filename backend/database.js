
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',       // default XAMPP username
    password: '',       // default XAMPP password (empty)
    database: 'timedb' // your database name
}).promise();

//----------------------------------------------
// calendar_event
//----------------------------------------------
export async function getEvents() {
    const [rows] = await pool.query('SELECT * FROM calendar_event');
    return rows;
}

export async function getEvent(id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM calendar_event 
        WHERE id = ?
        `, [id]);
    return rows[0];
}

export async function createEvent({ title, description, event_date, start_time, end_time }) {
    const [result] = await pool.query(`
        INSERT INTO calendar_event (title, description, event_date, start_time, end_time)
        VALUES (?, ?, ?, ?, ?)`, 
        [title, description, event_date, start_time, end_time]);
    const id = result.insertId;
    return getEvent(id);
}

export async function updateEvent(id, { title, description, event_date, start_time, end_time }) {
    const [result] = await pool.query(`
        UPDATE calendar_event 
        SET title = ?, description = ?, event_date = ?, start_time = ?, end_time = ?
        WHERE id = ?`, 
        [title, description, event_date, start_time, end_time, id]);
    return getEvent(id);
}

export async function deleteEvent(id) {
    const event = await getEvent(id);
    const [result] = await pool.query(`
        DELETE FROM calendar_event
        WHERE id = ?`, [id]);
    return event;
}

//----------------------------------------------
// todo_item
//----------------------------------------------
export async function getTodos() {
    const [rows] = await pool.query('SELECT * FROM todo_item');
    return rows;
}

export async function getTodo(id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM todo_item 
        WHERE id = ?
        `, [id]);
    return rows[0];
}

export async function createTodo({ title, is_checked, start_date, start_time, end_date, end_time, fk_dashboard, fk_app_user }) {
    const [result] = await pool.query(`
        INSERT INTO todo_item (title, is_checked, start_date, start_time, end_date, end_time, fk_dashboard, fk_app_user)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, is_checked, start_date, start_time, end_date, end_time, fk_dashboard, fk_app_user]);
    const id = result.insertId;
    return getTodo(id);
}

export async function deleteCheckedTodos(id) {
    const [result] = await pool.query(`
        DELETE FROM todo_item
        WHERE id = ?`, [id]);
    return result.affectedRows > 0;
}

//----------------------------------------------
// note
//----------------------------------------------
export async function getNotes() {
    try {
        const [rows] = await pool.query('SELECT * FROM note');
        return rows;
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
}

export async function getNote(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM note WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching note:', error);
        throw error;
    }
}

export async function createNote({ title, content }) {
    try {
        const [result] = await pool.query('INSERT INTO note (title, content) VALUES (?, ?)', [title, content]);
        const id = result.insertId;
        return getNote(id);
    } catch (error) {
        console.error('Error creating note:', error);
        throw error;
    }
}

export async function updateNote(id, { title, content }) {
    try {
        await pool.query('UPDATE note SET title = ?, content = ? WHERE id = ?', [title, content, id]);
        return getNote(id);
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
}

export async function deleteNote(id) {
    try {
        const note = await getNote(id);
        await pool.query('DELETE FROM note WHERE id = ?', [id]);
        return note;
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}

//----------------------------------------------
// comment
//----------------------------------------------
export async function getComments() {
    try {
        const [rows] = await pool.query('SELECT * FROM comments');
        return rows;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
}

export async function getComment(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching comment:', error);
        throw error;
    }
}

export async function createComment({ content, fk_app_user, fk_calendar_event }) {
    try {
        const [result] = await pool.query('INSERT INTO comments (content, fk_app_user, fk_calendar_event) VALUES (?, ?, ?)', [content, fk_app_user, fk_calendar_event]);
        const id = result.insertId;
        return getComment(id);
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
}

export async function updateComment(id, { content }) {
    try {
        await pool.query('UPDATE comments SET content = ? WHERE id = ?', [content, id]);
        return getComment(id);
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
}

export async function deleteComment(id) {
    try {
        const comment = await getComment(id);
        await pool.query('DELETE FROM comments WHERE id = ?', [id]);
        return comment;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
}

