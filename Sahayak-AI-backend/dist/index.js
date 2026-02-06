"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const userSchema = require("./db/model/models");
const resultSchema = require("./db/model/models");
const data_extractor = require("./services/index");
const app = (0, express_1.default)();
const db = require("./db/index");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
const aadharPath = path_1.default.join(__dirname, "../bucket/aadhar");
const licensePath = path_1.default.join(__dirname, "../bucket/license");
[aadharPath, licensePath].forEach((dir) => {
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
});
// ✅ Configure multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "frontImage" || file.fieldname === "rearImage") {
            cb(null, aadharPath); // Aadhaar folder
        }
        else if (file.fieldname === "licenseImage") {
            cb(null, licensePath); // License folder
        }
        else {
            cb(new Error("Unexpected field"), "");
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === "frontImage") {
            cb(null, "front.jpg");
        }
        else if (file.fieldname === "rearImage") {
            cb(null, "rear.jpg");
        }
        else if (file.fieldname === "licenseImage") {
            cb(null, "license.jpg");
        }
        else {
            cb(new Error("Unexpected field"), "");
        }
    },
});
const upload = (0, multer_1.default)({ storage });
// ✅ Upload route  // create user
app.post("/upload", upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "rearImage", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 },
]), 
//@ts-ignore
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const files = req.files;
    // console.log(files);
    if (!((_a = files === null || files === void 0 ? void 0 : files.frontImage) === null || _a === void 0 ? void 0 : _a.length) ||
        !((_b = files === null || files === void 0 ? void 0 : files.rearImage) === null || _b === void 0 ? void 0 : _b.length) ||
        !((_c = files === null || files === void 0 ? void 0 : files.licenseImage) === null || _c === void 0 ? void 0 : _c.length)) {
        return res.status(400).json({
            message: "All three images (front, rear, license) are required",
        });
    }
    let data;
    try {
        data = yield data_extractor();
        console.log(data);
    }
    catch (error) {
        console.log(error);
    }
    //@ts-ignore
    const { name, dob, gender, aadhaar_Number, address, photo_Path, Number, Date_of_Issue, Class_of_Vehicles, Issued_by, Fee_paid, Signature_Path,
    //@ts-ignore
     } = data;
    const userData = yield userSchema.create({
        name,
        dob,
        gender,
        aadhar_Number: aadhaar_Number,
        address,
        photo_path: photo_Path,
    });
    const resultData = yield resultSchema.create({
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
}));
app.get("/all-users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield userSchema.find({}).toArray();
    res.status(200).send({
        users: allUsers,
    });
}));
app.listen(3000, () => console.log("🚀 Server running on port 3000"));
