import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true}));

app.use(express.static('frontend'));

app.listen(prompt,() => {
    console.log(`Server is running on port ${port}`);
})

app.get('/api', (req, res) => {
    res.send('Hello, world!');
});