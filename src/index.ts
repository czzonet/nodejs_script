import { exec, execFile, spawn } from "child_process";
import * as path from "path";
import * as util from "util";

const CWD = path.join(process.cwd(), "source");

/**
 * 版本1：使用exec直接执行文件(手动promise回调转异步)
 */
const runCmd = async () =>
  new Promise((resolve, reject) => {
    exec("./run.sh ", { cwd: CWD }, (error, stdout, stderr) => {
      stderr ? reject(stderr) : resolve(stdout);
    });
  });

/**
 * 版本2：使用exec直接执行文件(promisify)
 */
const execPromisify = util.promisify(exec);
const runCmdPromisifty = async () => {
  return await execPromisify("./run.sh", { cwd: CWD });
};

/**
 * 版本3：使用execFile直接执行文件(promisify)
 */
const exexFilePromisify = util.promisify(execFile);
const runFilePormisify = async () =>
  await exexFilePromisify("./run.sh", { cwd: CWD });

/**
 * 版本4：读取类似ping不断输出的命令
 */
const readUpdateOutputPromisify = async () =>
  new Promise((resolve, reject) => {
    const ping = spawn("ping", ["127.0.0.1", "-c", "4"], {
      stdio: ["pipe", "pipe", "pipe"],
      cwd: __dirname,
      env: process.env,
      detached: true,
    });

    /** 监听输出 */
    ping.stdout.on("data", (data) => {
      /** data是buffer */
      console.log(`stdout: ${data.toString()}`);
    });

    /** 错误处理 */
    ping.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    /** 结束处理 */
    ping.on("close", (code) => {
      console.log(`子进程退出，退出码 ${code}`);
      resolve();
    });
  });

async function main() {
  let v1 = await runCmd();
  console.log("版本1：使用exec和手动 回调转异步：\n", v1);
  let v2 = await runCmdPromisifty();
  console.log("版本2：使用exec(promisify)：\n", v2);
  let v3 = await runFilePormisify();
  console.log("版本3：使用execfile(promisify)：\n", v3);

  console.log("版本4：读取类似ping不断输出的命令：\n");
  await readUpdateOutputPromisify();
}

main()
  .then((d) => {
    debugger;
  })
  .catch((e) => {
    console.log("[E] [main]", e);
    debugger;
  });
