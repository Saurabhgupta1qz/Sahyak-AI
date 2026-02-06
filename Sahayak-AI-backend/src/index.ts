import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
const userSchema = require("./db/model/models");
const resultSchema = require("./db/model/models");
const data_extractor = require("./services/index");

const app = express();

const db = require("./db/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.get("/create-user", async (req, res) => {
//   const {
//     name,
//     dob,
//     gender,
//     aadhar_number,
//     address,
//     photo_path,
//     Number,
//     Date_of_issue,
//     Class_of_Vehicles,
//     Issued_by,
//     Fee_paid,
//     Signature_path,
//   } = req.body;
//   const userData = await userSchema.create({
//     name,
//     dob,
//     gender,
//     aadhar_number,
//     address,
//     photo_path,
//   });
//   const resultData = await resultSchema.create({
//     Number,
//     Date_of_issue,
//     Class_of_Vehicles,
//     Issued_by,
//     Fee_paid,
//     Signature_path,
//   });

//   res.status(200);
// });

interface DrivingAadhaarData {
  name: string;
  dob: string;
  gender: string | null;
  aadhaar_Number: string;
  address: string;
  photo_Path: string | null;
  Number: string;
  Date_of_Issue: string;
  Class_of_Vehicles: string;
  Issued_by: string;
  Fee_paid: string | null;
  Signature_Path: string;
}

const aadharPath = path.join(__dirname, "../bucket/aadhar");
const licensePath = path.join(__dirname, "../bucket/license");

[aadharPath, licensePath].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "frontImage" || file.fieldname === "rearImage") {
      cb(null, aadharPath); // Aadhaar folder
    } else if (file.fieldname === "licenseImage") {
      cb(null, licensePath); // License folder
    } else {
      cb(new Error("Unexpected field"), "");
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "frontImage") {
      cb(null, "front.jpg");
    } else if (file.fieldname === "rearImage") {
      cb(null, "rear.jpg");
    } else if (file.fieldname === "licenseImage") {
      cb(null, "license.jpg");
    } else {
      cb(new Error("Unexpected field"), "");
    }
  },
});

const upload = multer({ storage });

// ✅ Define the request interface
interface UploadRequest extends Request {
  files: {
    frontImage?: Express.Multer.File[];
    rearImage?: Express.Multer.File[];
    licenseImage?: Express.Multer.File[];
  };
}

// ✅ Upload route  // create user
app.post(
  "/upload",
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "rearImage", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 },
  ]),
  //@ts-ignore
  async (req: UploadRequest, res: Response) => {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    // console.log(files);
    if (
      !files?.frontImage?.length ||
      !files?.rearImage?.length ||
      !files?.licenseImage?.length
    ) {
      return res.status(400).json({
        message: "All three images (front, rear, license) are required",
      });
    }
    let data: DrivingAadhaarData;

    try {
      data = await data_extractor();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    //@ts-ignore
    const {
      name,
      dob,
      gender,
      aadhaar_Number,
      address,
      photo_Path,
      Number,
      Date_of_Issue,
      Class_of_Vehicles,
      Issued_by,
      Fee_paid,
      Signature_Path,
      //@ts-ignore
    } = data;

    const userData = await userSchema.create({
      name,
      dob,
      gender,
      aadhar_Number: aadhaar_Number,
      address,
      photo_path: photo_Path,
    });
    const resultData = await resultSchema.create({
      Number,
      Date_of_issue: Date_of_Issue,
      Class_of_Vehicles,
      Issued_by,
      Fee_paid,
      Signature_Path,
    });

    // res.json({
    //   message: "Upload successful",
    //   files: {
    //     front: path.relative(process.cwd(), files.frontImage[0].path),
    //     rear: path.relative(process.cwd(), files.rearImage[0].path),
    //     license: path.relative(process.cwd(), files.licenseImage[0].path),
    //   },
    // });
    //@ts-ignore
    res.send(data);
  }
);
app.get("/all-users", async (req, res) => {
  const allUsers = await userSchema.find({}).toArray();
  res.status(200).send({
    users: allUsers,
  });
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
