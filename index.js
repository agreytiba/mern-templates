const express =require("express")
const multer =require("multer")
const ejs =require("ejs")
const path =require("path")

// set storage engine
const storage =multer.diskStorage({
    destination:'./public/uploads/',
    filename: function( req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }

})

//init upload
const upload =multer({
    storage:storage,
    
    fileFilter:function(req, file ,cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

//check file type
function checkFileType(file, cb){
//  aloowed ext
const filetypes =/(jpeg|jpg|png|gif)/;
// check ext
const extnames =filetypes.test(path.extname(file.originalname).toLowerCase());
// check mime
const mimetype = filetypes.test(file.mimetype)
if (mimetype && extnames) {
    return cb(null,true)
} else {
   cb('error:Image only');
}
}

// init app
const app = express()
// EJS
app.set('view engine','ejs')

// public folder
app.use(express.static('./public'))

app.get('/',(req,res)=>res.render('index'));
app.post('/upload',(req,res) =>{
 upload(req ,res, (err) =>{
    if(err){
        res.render('index',{msg:err});
    }else {
        if (req.file == undefined) {
            res.render('index', {
                msg: 'error: No File selected!'
            })
        } else{
            res.render('index', {
           msg:'file Uploaded!',
           file: `uploads/${req.file.filename}`
            })
        }
    }
 })
})

const port =3000
app.listen(port,()=>console.log(`server started on port${port}`))




