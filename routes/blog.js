const express = require("express");
const router = express.Router();
const database = require('../data/database');

router.get("/", function (req, res) {
  res.redirect("/posts");
});
router.get("/posts", async function (req, res) {
    const [posts] = await database.query('SELECT posts.*, authors.name FROM posts INNER JOIN authors ON posts.author_id = authors.id ');
  res.render("posts-list", {posts: posts});
});

router.get('/new-post',async function(req,res){
    const [authors] =await database.query('SELECT * FROM authors');

    res.render('create-post', {authors : authors});
});
router.post('/posts',async function(req,res){
    const dataOfPost = [
        req.body.title , 
        req.body.summary,
        req.body.content,
        req.body.author
    ]
    await database.query('INSERT INTO posts (title,summary,body,author_id) VALUES (?)',[dataOfPost])
    res.redirect('/posts');

});
router.get('/posts/:id', async function(req,res){
const postID = req.params.id;
const query = `
SELECT posts.* , authors.*
 FROM posts 
 INNER JOIN authors 
 ON posts.author_id = authors.id 
 WHERE posts.id = ?
`;
const [targetPost] = await database.query(query, postID);
if(targetPost.length === 0 || !targetPost ) {
  return res.render('404');
}
const post = {
  ...targetPost[0],
  date: targetPost[0].date.toISOString(),
  humanReadableDate: targetPost[0].date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
};

res.render('post-detail', {targetPost : post});
});

router.get('/update-post/:id',async function(req ,res){
const postID = req.params.id;
const query = `SELECT * 
FROM posts
 WHERE id = ?`;
const [postData] = await database.query(query, postID);


res.render('update-post', {post : postData[0]});
});

router.post('/update-post/:id', async function(req, res) {
  const postID = req.params.id;
  const newValues = req.body;
  const updateQuery = `
    UPDATE posts
    SET title = ?, summary = ?, body = ?
    WHERE id = ?`;
  await database.query(updateQuery, [newValues.title, newValues.summary, newValues.content, postID]);
  res.redirect('/posts');
});

router.post('/:id/delete',async function(req ,res){
const postID = req.params.id;
const deleteQuery = `
DELETE 
FROM posts
WHERE id = ?
`;
await database.query(deleteQuery, [postID]);
res.redirect('/posts');
});

module.exports = router;
