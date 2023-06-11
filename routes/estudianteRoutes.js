const express = require('express');
const estudianteController = require('../controllers/estudianteController');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const mysql = require('mysql2');

const router = express.Router();

AWS.config.update({
    accessKeyId: 'AKIAVCTNZQITY3YMPN4T',
    secretAccessKey: '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',
    region: 'us-east-2',
    ssl: {
        rejectUnauthorized: false // Para evitar el error de certificado no autorizado
      }
});

const s3 = new AWS.S3();

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

router.get('/', estudianteController.obtenerEstudiantes);
router.post('/', upload.single('imagen'), estudianteController.crearEstudiante);
router.get('/:id/editar', estudianteController.mostrarFormularioEdicion);
router.post('/:id', upload.single('imagen'), estudianteController.actualizarEstudiante);
router.delete('/:id', estudianteController.eliminarEstudiante);

module.exports = router;

