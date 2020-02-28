import { exec, execFile } from "child_process";
import * as path from 'path'
import * as util from 'util'

const CWD = path.join(process.cwd(), 'source')

/**
 * 执行外部脚本 并进行回调转异步  
 */
const runCmd = () => new Promise((resolve, reject) => {
  exec('./run.sh ', { cwd: CWD }, (error, stdout, stderr) => {
    console.log('[I]', stdout);
    stderr ? (console.log('[E]', stderr), reject(stderr)) : null
    resolve(true)
  })

});

/**
 * 版本2：使用promisify  
 */
const execPromisify = util.promisify(exec)
const runCmdPromisifty = async () => {
  return await execPromisify('./run.sh', { cwd: CWD })
}

/**
 * 版本3：使用execFile直接执行文件(promisify)
 */
const exexFilePromisify = util.promisify(execFile)
const runFilePormisify = async () => await exexFilePromisify('./run.sh', { cwd: CWD })

async function main() {
  console.log('版本1：使用exec和手动 回调转异步');

  await runCmd()
  let v2 = await runCmdPromisifty()
  console.log('版本2：使用promisify:', v2);
  let v3 = await runFilePormisify()
  console.log('版本3：使用execfile', v3);


}

main().then(d => {
  debugger
}).catch(e => {
  console.log('[E] [main]', e);
  debugger
})
