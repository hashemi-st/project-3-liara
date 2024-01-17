import * as http from 'http';

interface Route {
    method: string;
    path: string;
    handler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
  }
  
  interface Middleware {
    (req: http.IncomingMessage, res: http.ServerResponse, next: () => void): void;
  }
  
  interface App {
    routes: Route[];
    middleware: Middleware[];
    get(path: string, handler: (req: http.IncomingMessage, res: http.ServerResponse) => void): void;
    post(path: string, handler: (req: http.IncomingMessage, res: http.ServerResponse) => void): void;
    put(path: string, handler: (req: http.IncomingMessage, res: http.ServerResponse) => void): void;
    delete(path: string, handler: (req: http.IncomingMessage, res: http.ServerResponse) => void): void;
    use(middleware: Middleware): void;
    runMiddleware(req: http.IncomingMessage, res: http.ServerResponse, callback: () => void): void;
    listen(port: number, callback: () => void): void;
    handleRequest(req: CustomRequest, res: CustomResponse): void;
    serveStatic(directory: string): Middleware;
  }
  
  interface CustomResponse extends http.ServerResponse {
    json: (data:string)=>void
    redirect: (Location:string)=>void
  }

  interface CustomRequest extends http.IncomingMessage {
    body: string
    query: object
  }