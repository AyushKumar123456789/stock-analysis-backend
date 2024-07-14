import { v2 as cloudinary } from 'cloudinary';
import { error } from 'console';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upladOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return error('No file path provided');
        // Upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });
        //file has been uploaded to cloudinary
        console.log('File uploaded to cloudinary', response.url);
        return response;
    } catch (err) {
        fs.unlinkSync(localFilePath); //remove the file from local storage
        return error(err);
    }
};

export default upladOnCloudinary;
