import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
    region: process.env.region, // Choose the region where your bucket is located
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    },
  });
  
const upload_files = async (file)=>{
      
  try {
    const uploadParams = {
      Bucket: "onicorn-backend",
      Key: file.name,
      Body: file.data,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(uploadParams);
    const { Location } = await s3.send(command); // Use the send method to send the command
    const url = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;
      return url;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}
  
export { upload_files };