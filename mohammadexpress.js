import hashemiexpress from "./hashemiexpress.js";

const app = hashemiexpress();

const myMiddleware = (req, res, next) => {
    const queryParams = req.query || {};
    console.log("Query parameters:", queryParams); 
    console.log("Middleware is doing some work"); 
    req.customProperty = "this is a customProperty that added to query object"; 
    next();
  };


app.use(myMiddleware)

// Serve static files from the "public" directory
app.use(app.serveStatic('public'));

app.get('/', (req,res)=>{
    res.redirect('/redirect')
})
app.get('/redirect', (req,res)=>{
    res.json('this page is redirected from home')
})
app.post('/', (req,res)=>{
    console.log('this is req.body',req.body)
    res.json('this is post method')
})

app.listen(5000, ()=> {
    console.log('server is running from mohammad')
})