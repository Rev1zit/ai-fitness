const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Подключение к базе данных
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:123@localhost:5432/postgres',
});

// JWT секрет
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, имя и пароль обязательны' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hash, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Пользователь уже существует' });
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Неверные email или пароль' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Неверные email или пароль' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin } });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Нет токена' });
  const token = auth.split(' ')[1];
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Неверный токен' });
  }
};

const IAM_TOKEN = process.env.YANDEX_IAM_TOKEN;
const FOLDER_ID = 'b1g06j2svjppae8ntu75';

async function askYandexGPT(prompt) {
  const response = await axios.post(
    'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
    {
      modelUri: `gpt://${FOLDER_ID}/yandexgpt/latest`,
      completionOptions: {
        stream: false,
        temperature: 0.7,
        maxTokens: 600,
      },
      messages: [
        { role: "system", text: "Ты профессиональный фитнес-тренер и нутрициолог. Отвечай кратко и по делу." },
        { role: "user", text: prompt }
      ]
    },
    {
      headers: {
        'Authorization': `Api-Key ${IAM_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.result.alternatives[0].message.text;
}

app.post('/api/ai/complex', authenticate, async (req, res) => {
  const { weight, height, injuries, age, query_text } = req.body;
  const user_id = req.user.id;
  if (!weight || !height || !age) {
    return res.status(400).json({ error: 'Не все поля заполнены' });
  }
  try {
    const prompt = `Ты — профессиональный фитнес-тренер и нутрициолог.\nНа основе данных пользователя (вес: ${weight} кг, рост: ${height} см, возраст: ${age}, травмы: ${injuries || 'нет'}, пожелания: ${query_text || 'нет'}):\n\nСоставь персональный тренировочный комплекс (5 пунктов), рекомендации по нагрузкам (3-4 предложения) и рекомендации по питанию (3-4 предложения).\n\nОформи ответ так:\nКомплекс:\n[упражнения и советы]\n\nНагрузки:\n[рекомендации]\n\nПитание:\n[рекомендации]\n\nНе пиши ничего лишнего.`;
    const ai_response = await askYandexGPT(prompt);

    // ВЫВОДИМ ОТВЕТ В КОНСОЛЬ
    console.log('Ответ YandexGPT:', ai_response);

    await pool.query(
      'INSERT INTO ai_complexes (user_id, weight, height, injuries, age, query_text, ai_response) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [user_id, weight, height, injuries, age, query_text, ai_response]
    );
    res.json({ ai_response });
  } catch (err) {
    console.error('AI complex error:', err?.response?.data || err);
    res.status(500).json({ error: 'Ошибка сервера (YandexGPT)'});
  }
});

app.get('/api/ai/history', authenticate, async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      'SELECT id, weight, height, injuries, age, query_text, ai_response, created_at FROM ai_complexes WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json({ history: result.rows });
  } catch (err) {
    console.error('AI history error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/users', authenticate, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ error: 'Нет доступа' });
  try {
    const result = await pool.query('SELECT id, email, name, is_admin, created_at FROM users ORDER BY created_at DESC');
    res.json({ users: result.rows });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/user/:id/history', authenticate, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ error: 'Нет доступа' });
  const user_id = req.params.id;
  try {
    const result = await pool.query(
      'SELECT id, weight, height, injuries, age, query_text, ai_response, created_at FROM ai_complexes WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json({ history: result.rows });
  } catch (err) {
    console.error('Admin user history error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/admin/user/:id/delete', authenticate, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ error: 'Нет доступа' });
  const user_id = req.params.id;
  try {
    // Проверяем, является ли удаляемый пользователь админом
    const userRes = await pool.query('SELECT is_admin FROM users WHERE id = $1', [user_id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    if (userRes.rows[0].is_admin) {
      return res.status(403).json({ error: 'Нельзя удалить администратора' });
    }
    await pool.query('DELETE FROM ai_complexes WHERE user_id = $1', [user_id]);
    await pool.query('DELETE FROM users WHERE id = $1', [user_id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/admin/complex/:id/delete', authenticate, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ error: 'Нет доступа' });
  const complex_id = req.params.id;
  try {
    await pool.query('DELETE FROM ai_complexes WHERE id = $1', [complex_id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin delete complex error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ОТЗЫВЫ
// Получить все отзывы
app.get('/api/reviews', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT reviews.id, reviews.text, reviews.created_at, users.name as user_name FROM reviews\n       JOIN users ON reviews.user_id = users.id\n       ORDER BY reviews.created_at DESC`
    );
    res.json({ reviews: result.rows });
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавить отзыв (только для авторизованных)
app.post('/api/reviews', authenticate, async (req, res) => {
  const user_id = req.user.id;
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Текст отзыва обязателен' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO reviews (user_id, text) VALUES ($1, $2) RETURNING id, text, created_at',
      [user_id, text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 