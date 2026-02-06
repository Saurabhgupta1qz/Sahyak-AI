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
Object.defineProperty(exports, "__esModule", { value: true });
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
function aadhaarScan(pythonFilePath, imagesFolderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            //@ts-ignore
            fs.readdir(imagesFolderPath, (err, files) => {
                if (err)
                    return reject(err);
                // Filter image files (jpg, png, bmp)
                const imagePaths = files
                    .filter((f) => /\.(jpg|jpeg|png|bmp)$/i.test(f))
                    .map((f) => path.join(imagesFolderPath, f));
                if (imagePaths.length < 2) {
                    return reject(new Error("Need at least two images in the folder"));
                }
                // Take only the first two images
                const args = [pythonFilePath, imagePaths[0], imagePaths[1]];
                const pythonProcess = spawn("python", args);
                let output = "";
                let errorOutput = "";
                pythonProcess.stdout.on("data", (data) => {
                    output += data.toString();
                });
                pythonProcess.stderr.on("data", (data) => {
                    errorOutput += data.toString();
                });
                pythonProcess.on("close", (code) => {
                    if (code !== 0) {
                        return reject(new Error(`Python process exited with code ${code}\n${errorOutput}`));
                    }
                    try {
                        const jsonOutput = JSON.parse(output);
                        resolve(jsonOutput); // <-- Returns JSON object
                    }
                    catch (err) {
                        reject(new Error(`Failed to parse JSON output: ${err.message}\nOutput: ${output}`));
                    }
                });
            });
        });
    });
}
function licenseFormScan(pythonFilePath, imagePath) {
    return new Promise((resolve, reject) => {
        // Adjust this if your python executable is 'python3' or full path
        const pythonExec = "python";
        const scriptPath = path.resolve(pythonFilePath);
        const process = spawn(pythonExec, [scriptPath, imagePath]);
        let output = "";
        let errorOutput = "";
        process.stdout.on("data", (data) => {
            output += data.toString();
        });
        process.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });
        process.on("close", (code) => {
            if (code !== 0) {
                return reject(new Error(`Python script exited with code ${code}\n${errorOutput}`));
            }
            try {
                const json = JSON.parse(output);
                resolve(json);
            }
            catch (err) {
                reject(new Error(`Failed to parse JSON output: ${err.message}\nOutput: ${output}`));
            }
        });
    });
}
// const data_extractor = async () => {
//   try {
//     const { Name, DOB, Gender, Aadhaar_Number, Address, Photo_Path } =
//       await aadhaarScan(
//         "dist/services/Aadhar_Data_Extractor.py",
//         "dist/bucket/aadhaar"
//       );
//     const {
//       Number,
//       Date_of_Issue,
//       Class_of_Vehicles,
//       Issued_by,
//       Fee_paid,
//       Signature_Path,
//     } = await licenseFormScan(
//       "dist/services/DataExtractor.py",
//       "dist/bucket/license"
//     );
//     console.log("Returned JSON object:", Number);
//     return {
//       Name,
//       DOB,
//       Gender,
//       Aadhaar_Number,
//       Address,
//       Photo_Path,
//       Number,
//       Date_of_Issue,
//       Class_of_Vehicles,
//       Issued_by,
//       Fee_paid,
//       Signature_Path,
//     };
//     // result is the JSON object returned by Python
//   } catch (err) {
//     console.error("Error:", err);
//     throw err;
//   }
//   return { error: "empty" };
// };
const data_extractor = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Aadhaar extraction
        const aadhaar = yield aadhaarScan(path.resolve(__dirname, "./Aadhar_Data_Extractor.py"), path.resolve(__dirname, "../../bucket/aadhaar"));
        // License extraction
        const license = yield licenseFormScan(path.resolve(__dirname, "./DataExtractor.py"), path.resolve(__dirname, "../../bucket/license"));
        console.log("Aadhaar Extracted:", aadhaar);
        console.log("License Extracted:", license);
        // Return combined object
        return Object.assign(Object.assign({}, aadhaar), license);
    }
    catch (err) {
        console.error("Error in data_extractor:", err);
        throw err; // Important: propagate to route handler
    }
});
exports.default = data_extractor;
module.exports = data_extractor;
