const { EntitySchema } = require('typeorm');

const ArticleSchema = new EntitySchema({
  name: 'Article',
  columns: {
    id: {
      primary: true,
      generated: true,
      type: 'int',
    },
    title: {
      type: 'varchar',
    },
    content: {
      type: 'text',
    },
  },
});

module.exports = ArticleSchema;
