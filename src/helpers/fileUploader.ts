import multer from "multer"
import path from "path"
import { v2 as cloudinary } from 'cloudinary';

//Configuration
cloudinary.config({ 
        cloud_name: 'dwcteslem', 
        api_key: '882483635743736', 
        api_secret: 'Uw6I7mTS6W29IiF1PwpcLEqs6jc' // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(),'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });




const uploadToCloudinary = async(file: any) => {

    
  
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           file.path, {
              public_id: file.originalname,
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
}


export const fileUploader = {
    upload,
    uploadToCloudinary
}