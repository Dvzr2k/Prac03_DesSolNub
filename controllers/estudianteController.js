const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const mysql = require('mysql2');

const s3 = new AWS.S3({
  accessKeyId: 'AKIAVCTNZQITY3YMPN4T',
  secretAccessKey: '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',
  region: 'us-east-2',
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'valdezbucket',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = file.fieldname + '-' + uniqueSuffix;
      cb(null, filename);
    },
  }),
});

const connection = mysql.createConnection({
  host: 'aws.connect.psdb.cloud',
  user: 'ufpquobpx5aipl3f1p9a',
  password: 'pscale_pw_7nprxUbzXTwsIAmKkzevvcs5hKedXk2F6el2xNzw4H9',
  database: 'productsdb',
  ssl: {
    rejectUnauthorized: false // Para evitar el error de certificado no autorizado
  }
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Conexión exitosa a la base de datos');
});

exports.obtenerEstudiantes = (req, res) => {
  connection.query('SELECT * FROM estudiantes', (error, rows) => {
    if (error) throw error;
    res.render('index', { estudiantes: rows });
  });
};

exports.crearEstudiante = (req, res) => {
  const { nombre, apellido, edad, curso } = req.body;
  const imagen = req.file ? req.file.location : null;

  const estudiante = {
    nombre,
    apellido,
    edad,
    curso,
    imagen,
  };

  connection.query('INSERT INTO estudiantes SET ?', estudiante, (error, result) => {
    if (error) throw error;
    res.redirect('/estudiantes');
  });
};

exports.actualizarEstudiante = (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, edad, curso } = req.body;
    const imagen = req.file ? req.file.location : null;
  
    const estudiante = {
      nombre,
      apellido,
      edad,
      curso,
    };
  
    if (imagen) {
      estudiante.imagen = imagen;
    }
  
    connection.query('UPDATE estudiantes SET ? WHERE id = ?', [estudiante, id], (error, result) => {
      if (error) {
        console.error('Error al actualizar el estudiante:', error);
        throw error;
      }
  
      // Obtener el estudiante actualizado de la base de datos
      connection.query('SELECT * FROM estudiantes WHERE id = ?', id, (error, rows) => {
        if (error) {
          console.error('Error al obtener el estudiante actualizado:', error);
          throw error;
        }
  
        // Renderizar la vista de edición con el estudiante actualizado
        res.redirect(`/estudiantes`);
      });
    });
  };
  

exports.eliminarEstudiante = (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM estudiantes WHERE id = ?', id, (error, result) => {
    if (error) throw error;
    res.redirect('/estudiantes');
  });
};

exports.mostrarFormularioEdicion = (req, res) => {
    const { id } = req.params;
  
    // Obtener los datos del estudiante con el ID proporcionado y pasarlos a la vista
    connection.query('SELECT * FROM estudiantes WHERE id = ?', id, (error, result) => {
      if (error){
        console.error(error);
        throw error;
      } 
  
      const estudiante = result[0]; // Obtener el primer estudiante (debería haber solo uno)
  
      res.render('editar_estudiante', { estudiante: estudiante});
    });
  };
  

