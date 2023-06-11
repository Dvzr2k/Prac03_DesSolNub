const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const estudianteRoutes = require('./routes/estudianteRoutes');

const app = express();
const port = 5000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/estudiantes', estudianteRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
  });
  

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
