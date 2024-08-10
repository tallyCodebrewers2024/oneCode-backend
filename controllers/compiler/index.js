const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");

const docker = new Docker();

exports.runcode = async (req, res) => {
    const { code, language } = req.body;

    let fileName,
        compileCmd,
        runCmd,
        image,
        binaryName = "Main";
    let codeFileBaseName = `code_${Date.now()}`;

    switch (language) {
        case "python":
            fileName = codeFileBaseName + ".py";
            compileCmd = null;
            runCmd = `python ${fileName}`;
            image = "python:latest";
            break;
        case "c":
            fileName = codeFileBaseName + ".c";
            compileCmd = `gcc ${fileName} -o ${binaryName}`;
            runCmd = `./${binaryName}`;
            image = "gcc:latest";
            break;
        case "cpp":
            fileName = codeFileBaseName + ".cpp";
            compileCmd = `g++ ${fileName} -o ${binaryName}`;
            runCmd = `./${binaryName}`;
            image = "gcc:latest";
            break;
        case "java":
            fileName = "Main.java";
            compileCmd = `javac ${fileName}`;
            runCmd = `java ${binaryName}`;
            image = "openjdk:24-slim-bullseye";
            break;
        default:
            return res.status(400).json({ error: "Unsupported language" });
    }

    const filePath = path.join(__dirname, "codes", fileName);
    fs.writeFileSync(filePath, code);

    let container;
    try {
        // Record the start time
        
        // Create Docker container
        container = await docker.createContainer({
            Image: image,
            AttachStdout: true,
            AttachStderr: true,
            HostConfig: {
                Binds: [`${filePath}:/usr/src/app/${fileName}`],
                // AutoRemove: true,
            },
            WorkingDir: "/usr/src/app",
            Cmd: compileCmd
                ? ["sh", "-c", `${compileCmd} && ${runCmd}`]
                : runCmd.split(" "),
        });
        
        // Start the container
        await container.start();
        
        // const containerInfo = await container.inspect();
        // const startTime = containerInfo.State.StartedAt;

        // let isRunning = false;
        // while (!isRunning) {
        //     const containerInfo = await container.inspect();
        //     isRunning = containerInfo.State.Running
        //     await new Promise((resolve) => setTimeout(resolve, 50)); // Wait for a bit before checking again
        // }
        
        // const startTime = process.hrtime();

        
        // Capture output with stream handling
        let output = "";
        output = await new Promise((resolve, reject) => {
            container.logs(
                { stdout: true, stderr: false, follow: true },
                (err, stream) => {
                    if (err) {
                        return reject(err);
                    }
                    let result = "";
                    
                    stream.on("data", (chunk) => {
                        result += chunk.toString("utf8"); // Convert buffer to UTF-8 string
                    });
                    
                    stream.on("end", () => {
                        result = result.replace(
                            /[\u0000-\u001F\u007F-\u009F]/g,
                            ""
                        ); // Clean the output
                        resolve(result);
                    });
                    
                    stream.on("error", (err) => {
                        reject(err);
                    });
                }
            );
        });
        // const endTime = process.hrtime(startTime);
        
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
                        result += chunk.toString("utf8"); // Convert buffer to UTF-8 string
                    });
                    
                    stream.on("end", () => {
                        result = result.replace(
                            /[\u0000-\u001F\u007F-\u009F]/g,
                            ""
                        ); // Clean the output
                        resolve(result);
                    });
                    
                    stream.on("error", (err) => {
                        reject(err);
                    });
                }
            );
        });

        const containerInfo = await container.inspect();
        const startTime = containerInfo.State.StartedAt;
        const endTime = containerInfo.State.FinishedAt;
        console.log("Start Time: ", startTime);
        console.log("End Time: ", endTime);

        const runtime = new Date(endTime) - new Date(startTime);

        // Wait for the container to finish
        await container.wait();
        await container.remove();
        // Record the end time
        
        // Convert the runtime to seconds and milliseconds
        // const runtime = (endTime[0] + endTime[1] / 1e9).toFixed(6) + " seconds";

        res.status(201).json({ output, error, runtime });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "An error occurred while compiling the code",
        });
    } finally {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Ensure the file is deleted even if an error occurs
                console.log(`Deleted file: ${filePath}`);
            } else {
                console.log(`File not found: ${filePath}`);
            }
        } catch (cleanupError) {
            console.error("Error during file cleanup:", cleanupError);
        }
    }
};
