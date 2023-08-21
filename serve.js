import handler from 'serve-handler'
import http from 'node:http'
import { exec } from 'node:child_process'

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response, {
    public: 'dist'
  });
});

server.listen(0, () => {
  const address = server.address()
  const url = `http://localhost:${address.port}`
  console.log(url)
  exec(`start ${url}`)
})