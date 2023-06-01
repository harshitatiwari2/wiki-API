const express = require('express');
const { createConnection, getRepository } = require('typeorm');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult, check } = require('express-validator');
require('dotenv').config();



const  ArticleSchema  = require('./Article');


const app = express();
const PORT = 3000;
// const SECRET_KEY = '';
// const crypto = require('crypto');



app.use(express.json());

// Connecting to the PostgreSQL database using TypeORM
createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'wikiDB',
  entities: [ArticleSchema],
  synchronize: true,
})
  .then(() => {
    console.log('Connected to the PostgreSQL database');
  })
  .catch((error) => {
    console.error('Error connecting to the PostgreSQL database:', error);
  });

app.get('/articles', async (req, res) => {
  try {
    const articleRepository = getRepository(ArticleSchema); // Obtain the repository for the Article entity
    const articles = await articleRepository.find();
    
    res.json(articles);
    console.log(articles);
  } catch (error) {
    console.error('Error retrieving articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GETTING A specific article
app.get('/articles/:id', async (req, res) => {
  try {
    const articleRepository = getRepository(ArticleSchema); 
    const abc = req.params.id ;
    const article = await articleRepository.findOne({ where: { id: abc } });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error retrieving article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post(
  '/articles',
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('content').notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content } = req.body;

      const newArticle = new ArticleSchema();
      newArticle.title = title;
      newArticle.content = content;

      await newArticle.save();

      res.status(201).json({ message: 'Article created successfully' });
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

app.put(
  '/articles/:id',
  [
    check('title').optional().notEmpty().withMessage('Title is required'),
    check('content').optional().notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content } = req.body;
      const article = await ArticleSchema.findOne(req.params.id);

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      if (title) article.title = title;
      if (content) article.content = content;

      await article.save();

      res.json({ message: 'Article updated successfully' });
    } catch (error) {
      console.error('Error updating article:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);


app.delete('/articles/:id', async (req, res) => {
  try {
    const articleRepository = getRepository(ArticleSchema); 
    const abc = req.params.id ;
    const article = await articleRepository.findOne({ where: { id: abc } });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    await article.remove();

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
