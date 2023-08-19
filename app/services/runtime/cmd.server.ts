import { spawn } from 'child_process'

export const cmd = (command: string, args: string, cwd?: string) => {
  console.log({ command, args, cwd })
  enum State {
    Initial = 'initial',
    Body = 'body',
    End = 'end',
  }
  let result = ''
  let state = State.Initial
  let prevChar = ''

  const promise = new Promise<string | null>((resolve, reject) => {
    const childProcess = spawn(command, args.split(' '), { cwd })
    childProcess.on('error', (err) => {
      reject(err)
    })
    childProcess.stdout.on('data', (data) => {
      const str = data.toString()
      console.log(str)
      for (let i = 0; i < str.length; i++) {
        const c = str.charAt(i)
        switch (state) {
          case State.Initial:
            if (c === '\n' && prevChar === '\n') {
              state = State.Body
            }
            break
          case State.Body:
            if (c === '\n' && prevChar === '\n') {
              state = State.End
            } else {
              result += c
            }
            break
          case State.End:
            // do nothing
            break
        }
        prevChar = c
      }
    })
    childProcess.stdout.on('end', () => {
      resolve(result)
    })
  })
  return promise
}
