const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

interface AadhaarData {
  Name: string;
  DOB: string;
  Gender: string;
  Aadhaar_Number: string;
  Address: string;
  Photo_Path: string;
}

interface DrivingLicenseData {
  Number: string;
  Date_of_Issue: string;
  Class_of_Vehicles: string;
  Issued_by: string;
  Fee_paid: string | null;
  Signature_Path: string;
}

async function aadhaarScan(
  pythonFilePath: string,
  imagesFolderPath: string
): Promise<AadhaarData> {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    fs.readdir(imagesFolderPath, (err, files) => {
      if (err) return reject(err);

      // Filter image files (jpg, png, bmp)
      const imagePaths = files
        .filter((f: any) => /\.(jpg|jpeg|png|bmp)$/i.test(f))
        .map((f: any) => path.join(imagesFolderPath, f));

      if (imagePaths.length < 2) {
        return reject(new Error("Need at least two images in the folder"));
      }

      // Take only the first two images
      const args = [pythonFilePath, imagePaths[0], imagePaths[1]];

      const pythonProcess = spawn("python", args);

      let output = "";
      let errorOutput = "";

      pythonProcess.stdout.on("data", (data: any) => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", (data: any) => {
        errorOutput += data.toString();
      });

      pythonProcess.on("close", (code: any) => {
        if (code !== 0) {
          return reject(
            new Error(`Python process exited with code ${code}\n${errorOutput}`)
          );
        }
        try {
          const jsonOutput = JSON.parse(output);
          resolve(jsonOutput); // <-- Returns JSON object
        } catch (err: any) {
          reject(
            new Error(
              `Failed to parse JSON output: ${err.message}\nOutput: ${output}`
            )
          );
        }
      });
    });
  });
}

function licenseFormScan(
  pythonFilePath: string,
  imagePath: string
): Promise<DrivingLicenseData> {
  return new Promise((resolve, reject) => {
    // Adjust this if your python executable is 'python3' or full path
    const pythonExec = "python";
    const scriptPath = path.resolve(pythonFilePath);

    const process = spawn(pythonExec, [scriptPath, imagePath]);

    let output = "";
    let errorOutput = "";

    process.stdout.on("data", (data: any) => {
      output += data.toString();
    });

    process.stderr.on("data", (data: any) => {
      errorOutput += data.toString();
    });

    process.on("close", (code: any) => {
      if (code !== 0) {
        return reject(
          new Error(`Python script exited with code ${code}\n${errorOutput}`)
        );
      }
      try {
        const json = JSON.parse(output);
        resolve(json);
      } catch (err: any) {
        reject(
          new Error(
            `Failed to parse JSON output: ${err.message}\nOutput: ${output}`
          )
        );
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

const data_extractor = async () => {
  try {
    // Aadhaar extraction
    const aadhaar = await aadhaarScan(
      path.resolve(__dirname, "./Aadhar_Data_Extractor.py"),
      path.resolve(__dirname, "../../bucket/aadhaar")
    );
    // License extraction
    const license = await licenseFormScan(
      path.resolve(__dirname, "./DataExtractor.py"),
      path.resolve(__dirname, "../../bucket/license")
    );

    console.log("Aadhaar Extracted:", aadhaar);
    console.log("License Extracted:", license);

    // Return combined object
    return {
      ...aadhaar,
      ...license,
    };
  } catch (err) {
    console.error("Error in data_extractor:", err);
    throw err; // Important: propagate to route handler
  }
};

export default data_extractor;

module.exports = data_extractor;
