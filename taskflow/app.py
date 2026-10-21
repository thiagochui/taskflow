import os
import sqlite3
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
DB = os.path.join(os.path.dirname(__file__), 'tasks.db')

def connect():
    db = sqlite3.connect(DB)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    with connect() as db:
        db.execute('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0)')

@app.get('/')
def home():
    return render_template('index.html')

@app.get('/api/tasks')
def tasks():
    with connect() as db:
        return jsonify([dict(row) for row in db.execute('SELECT * FROM tasks ORDER BY id DESC')])

@app.post('/api/tasks')
def add():
    title = str((request.get_json(silent=True) or {}).get('title', '')).strip()
    if not title or len(title) > 120:
        return jsonify(error='Informe uma tarefa de até 120 caracteres.'), 400
    with connect() as db:
        cursor = db.execute('INSERT INTO tasks (title) VALUES (?)', (title,))
        return jsonify(id=cursor.lastrowid, title=title, done=0), 201

@app.patch('/api/tasks/<int:task_id>')
def toggle(task_id):
    with connect() as db:
        row = db.execute('SELECT done FROM tasks WHERE id=?', (task_id,)).fetchone()
        if row is None:
            return jsonify(error='Tarefa não encontrada.'), 404
        db.execute('UPDATE tasks SET done=? WHERE id=?', (1 - row['done'], task_id))
        return jsonify(ok=True)

@app.delete('/api/tasks/<int:task_id>')
def delete(task_id):
    with connect() as db:
        cursor = db.execute('DELETE FROM tasks WHERE id=?', (task_id,))
        if not cursor.rowcount:
            return jsonify(error='Tarefa não encontrada.'), 404
        return jsonify(ok=True)

init_db()

if __name__ == '__main__':
    app.run(debug=True)
