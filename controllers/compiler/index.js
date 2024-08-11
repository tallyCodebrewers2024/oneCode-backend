const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const docker = new Docker();

// exports.runcode = async (req, res) => {
//     const { code, language } = req.body;

//     let fileName,
//         compileCmd,
//         runCmd,
//         image,
//         binaryName = "Main";
//     let codeFileBaseName = `code_${Date.now()}`;

//     switch (language) {
//         case "python":
//             fileName = codeFileBaseName + ".py";
//             compileCmd = null;
//             runCmd = `python ${fileName}`;
//             image = "python:latest";
//             break;
//         case "c":
//             fileName = codeFileBaseName + ".c";
//             compileCmd = `gcc ${fileName} -o ${binaryName}`;
//             runCmd = `./${binaryName}`;
//             image = "gcc:latest";
//             break;
//         case "cpp":
//             fileName = codeFileBaseName + ".cpp";
//             compileCmd = `g++ ${fileName} -o ${binaryName}`;
//             runCmd = `./${binaryName}`;
//             image = "gcc:latest";
//             break;
//         case "java":
//             fileName = "Main.java";
//             compileCmd = `javac ${fileName}`;
//             runCmd = `java ${binaryName}`;
//             image = "openjdk:24-slim-bullseye";
//             break;
//         default:
//             return res.status(400).json({ error: "Unsupported language" });
//     }

//     const filePath = path.join(__dirname, "codes", fileName);
//     fs.writeFileSync(filePath, code);

//     let container;
//     try {
//         // Create Docker container
//         container = await docker.createContainer({
//             Image: image,
//             AttachStdout: true,
//             AttachStderr: true,
//             HostConfig: {
//                 Binds: [`${filePath}:/usr/src/app/${fileName}`],
//                 // AutoRemove: true,
//             },
//             WorkingDir: "/usr/src/app",
//             Cmd: compileCmd
//                 ? ["sh", "-c", `${compileCmd} && ${runCmd}`]
//                 : runCmd.split(" "),
//         });

//         // Start the container
//         await container.start();

//         // Capture output with stream handling
//         let output = "";
//         output = await new Promise((resolve, reject) => {
//             container.logs(
//                 { stdout: true, stderr: false, follow: true },
//                 (err, stream) => {
//                     if (err) {
//                         return reject(err);
//                     }
//                     let result = "";

//                     stream.on("data", (chunk) => {
//                         result += chunk.toString("utf8");
//                     });

//                     stream.on("end", () => {
//                         result = result.replace(
//                             /[\u0000-\u001F\u007F-\u009F]/g,
//                             ""
//                         );
//                         resolve(result);
//                     });

//                     stream.on("error", (err) => {
//                         reject(err);
//                     });
//                 }
//             );
//         });

//         let error = "";
//         error = await new Promise((resolve, reject) => {
//             container.logs(
//                 { stdout: false, stderr: true, follow: true },
//                 (err, stream) => {
//                     if (err) {
//                         return reject(err);
//                     }
//                     let result = "";

//                     stream.on("data", (chunk) => {
//                         result += chunk.toString("utf8");
//                     });

//                     stream.on("end", () => {
//                         result = result.replace(
//                             /[\u0000-\u001F\u007F-\u009F]/g,
//                             ""
//                         );
//                         resolve(result);
//                     });

//                     stream.on("error", (err) => {
//                         reject(err);
//                     });
//                 }
//             );
//         });

//         const containerInfo = await container.inspect();
//         const startTime = containerInfo.State.StartedAt;
//         const endTime = containerInfo.State.FinishedAt;

//         const runtime = new Date(endTime) - new Date(startTime);

//         // Wait for the container to finish
//         await container.wait();
//         await container.remove();

//         res.status(201).json({ output, error, runtime });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             error: "An error occurred while compiling the code",
//         });
//     } finally {
//         try {
//             if (fs.existsSync(filePath)) {
//                 fs.unlinkSync(filePath);
//                 console.log(`Deleted file: ${filePath}`);
//             } else {
//                 console.log(`File not found: ${filePath}`);
//             }
//         } catch (cleanupError) {
//             console.error("Error during file cleanup:", cleanupError);
//         }
//     }
// };

exports.runcode = async (req, res) => {
    let { code, language, input } = req.body;

    if (input === undefined) input = "";

    let fileName,
        compileCmd,
        runCmd,
        image = "code_runner:alpine";
    let binaryName = "code_exec";
    let codeFileBaseName = `code_${Date.now()}`;

    switch (language) {
        case "python":
            fileName = codeFileBaseName + ".py";
            compileCmd = null;
            runCmd = `python ${fileName}`;
            binaryName = `python ${fileName}`;
            break;
        case "c":
            fileName = codeFileBaseName + ".c";
            compileCmd = `gcc ${fileName} -o ${codeFileBaseName}`;
            runCmd = `./${codeFileBaseName}`;
            binaryName = `./${codeFileBaseName}`;
            break;
        case "cpp":
            fileName = codeFileBaseName + ".cpp";
            compileCmd = `g++ ${fileName} -o ${codeFileBaseName}`;
            runCmd = `./${codeFileBaseName}`;
            binaryName = `./${codeFileBaseName}`;
            break;
        case "java":
            fileName = "Main.java";
            compileCmd = `javac ${fileName}`;
            runCmd = `java -cp . Main`;
            binaryName = `java -cp . Main`;
            break;
        default:
            return res.status(400).json({ error: "Unsupported language" });
    }

    // Ensure the directory exists
    const codesDir = path.join(__dirname, "codes");
    if (!fs.existsSync(codesDir)) {
        fs.mkdirSync(codesDir);
    }

    const filePath = path.join(__dirname, "codes", fileName);

    const inputFileName = `input_${Date.now()}.txt`;
    const inputFilePath = path.join(__dirname, "codes", inputFileName);

    try {
        fs.writeFileSync(filePath, code);
        fs.writeFileSync(inputFilePath, input);
    } catch (error) {
        console.log(error);
    }

    let container;
    try {
        // Create Docker container
        container = await docker.createContainer({
            Image: image,
            AttachStdout: true,
            AttachStderr: true,
            HostConfig: {
                Binds: [
                    `${filePath}:/usr/src/app/${fileName}`,
                    `${inputFilePath}:/usr/src/app/input.txt`,
                ],
                AutoRemove: false,
            },
            WorkingDir: "/usr/src/app",
            Cmd: [
                "/usr/src/app/run_and_measure.sh",
                fileName,
                binaryName,
                compileCmd ? compileCmd : null,
            ],
        });

        // Start the container
        await container.start();

        // Capture output
        let outputString = await new Promise((resolve, reject) => {
            container.logs(
                { stdout: true, stderr: false, follow: true },
                (err, stream) => {
                    if (err) {
                        return reject(err);
                    }
                    let result = "";

                    stream.on("data", (chunk) => {
                        result += chunk
                            .toString("utf8")
                            // .replace(/[\x00-\x1F\x7F]/g, "");
                            .replace(/[^\x09\x0A\x20-\x7E]+/g, '');
                    });

                    stream.on("end", () => {
                        resolve(result);
                    });

                    stream.on("error", (err) => {
                        reject(err);
                    });
                }
            );
        });

        let error = "";
        error = await new Promise((resolve, reject) => {
            container.logs(
                { stdout: false, stderr: true, follow: true },
                (err, stream) => {
                    if (err) {
                        return reject(err);
                    }
                    let result = "";

                    stream.on("data", (chunk) => {
                        result += chunk.toString("utf8");
                    });

                    stream.on("end", () => {
                        result = result.replace(
                            /[\u0000-\u001F\u007F-\u009F]/g,
                            ""
                        );
                        resolve(result);
                    });

                    stream.on("error", (err) => {
                        reject(err);
                    });
                }
            );
        });

        await container.wait();
        await container.remove();

        const output = outputString.split(" _____ ")[0];
        const runtime = outputString.split(" _____ ")[1];
        const memory = outputString.split(" _____ ")[2];

        res.status(200).json({
            output,
            runtime,
            memory,
            error,
            outputString,
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: "An error occurred while executing the code.",
        });
    } finally {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            if (fs.existsSync(inputFilePath)) {
                fs.unlinkSync(inputFilePath);
            }
        } catch (cleanupError) {
            console.error("Error during file cleanup:", cleanupError);
        }
    }
};
