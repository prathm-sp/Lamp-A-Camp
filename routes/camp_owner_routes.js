const express = require("express");
const multer = require('multer');
const router = express.Router();
const owner_controllers = require("../controllers/camp_owner_controllers");
const auth = require("../middleware/camp_owner_auth");


const storage = multer.diskStorage({
destination: function(req, file, cb) {
    const mimetype = file.mimetype;
    const mimetype_splitted = mimetype.split("/");
    console.log(mimetype_splitted);
    const uuid = require("uuid").v4() + file.originalname;
    const name = uuid;
    file.originalname = name;
    cb(null, './uploads/');
},
filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname); 
}
});

const upload = multer({storage : storage});


router.post('/signup',owner_controllers.signup)

router.post('/login', owner_controllers.login);

router.get('/auth', auth , owner_controllers.auth);

router.put('/updateuser', auth , owner_controllers.update);

router.put('/updatepassword', auth , owner_controllers.updatePassword);

router.delete('/delete_user', auth , owner_controllers.delete_user);

router.get('/getuser', auth , owner_controllers.find_specific_user);

router.post('/create_camp',auth , owner_controllers.create_a_camp);

router.post('/upload/image',upload.array('image'), owner_controllers.upload_image)

router.get('/pending_camps', auth , owner_controllers.get_pending_camps );

router.get('/pending_for_payment',auth , owner_controllers.get_pending_for_payment);

router.get('/approved',auth ,owner_controllers.get_payament_success);


module.exports = router;