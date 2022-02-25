const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello!');
})


// app.set('view engine', 'ejs');


// app.get('/', (req, res) => {
//     res.render('index');
// })









app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})