const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/usersControllers");
const upload = require("../multerconfig/storageConfig")
const upload_pdf = require("../multerconfig/Pdf")
const authenticate = require("../middleware/authenticate")

// routes


router.post('/doc/signup', controllers.signup);
router.post('/doc/signin', controllers.signin);
router.post('/doc/patsignup', controllers.patsignup);


router.get("/doc/validuser",authenticate,controllers.validuser);



router.post('/doc/upload_pdf', upload_pdf.single("pdf"), controllers.uploadPdf);

router.post('/doc/connectpatient', controllers.connect);

router.get("/patient/details",controllers.patientget);
router.get("/doc/mypatient",controllers.mypatient);


// 
module.exports = router