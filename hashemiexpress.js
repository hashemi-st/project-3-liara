import * as http from "http";
import * as url from "url";
import * as fs from "fs";
import * as path from "path";

function hashemiexpress() {
  const app = {
    routes: [],

    middleware: [],

    get(path, handler) {
      this.routes.push({ method: "GET", path, handler });
    },

    post(path, handler) {
      this.routes.push({ method: "POST", path, handler });
    },

    put(path, handler) {
      this.routes.push({ method: "PUT", path, handler });
    },

    delete(path, handler) {
      this.routes.push({ method: "DELETE", path, handler });
    },

    use(middleware) {
      this.middleware.push(middleware);
    },

    runMiddleware(req, res, callback) {
      const runNextMiddleware = (index) => {
        if (index < this.middleware.length) {
          const currentMiddleware = this.middleware[index];
          currentMiddleware(req, res, () => runNextMiddleware(index + 1));
        } else {
          callback();
        }
      };
      runNextMiddleware(0);
    },

    handleRequest(req, res) {
      let body = [];

      req
        .on("data", (chunk) => {
          body.push(chunk);
        })
        .on("end", () => {
          body = Buffer.concat(body).toString();
          req.body = body ? JSON.parse(body) : {};

          const parsedUrl = url.parse(req.url || "", true);
          req.query = parsedUrl.query;

          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          res.redirect = (location) => {
            res.setHeader("Location", location);
            res.statusCode = 302;
            res.end();
          };


          this.runMiddleware(req, res, () => {
            const route = this.routes.find(
              (r) => r.method === req.method && r.path === parsedUrl.pathname
            );
            if (route) {
              route.handler(req, res);
            } else {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("Page Not Found");
            }
          });
        });
    },
    serveStatic(directory) {
      return (req, res, next) => {
        const parsedUrl = url.parse(req.url || "", true);

        const __fileName = url.fileURLToPath(import.meta.url) 
        const __dirname = path.dirname(__fileName)
        const filePath = path.join(__dirname, directory, parsedUrl.pathname);

        fs.stat(filePath, (err, stats) => {
          if (err) {
            next();
            return;
          }

          if (stats.isDirectory()) {
            const indexPath = path.join(filePath, "index.html");

            fs.access(indexPath, fs.constants.F_OK, (err) => {
              if (err) {
                console.log(`Index.html not found in directory: ${filePath}`);
                next();
                return;
              }

              fs.createReadStream(indexPath).pipe(res);
            });
          } else {
            fs.createReadStream(filePath).pipe(res);
          }
        });
      };
    },
    listen(port) {
      const server = http.createServer((req, res) => {
        this.handleRequest(req, res);
      });

      server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    },
  };
  return app;
}
export default hashemiexpress;
