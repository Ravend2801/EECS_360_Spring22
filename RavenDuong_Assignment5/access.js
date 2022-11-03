//create server method for http
const {createServer} = require("http");
//declare an object called methods to store the functions that handle the various HTTP methods 
const methods = Object.create(null);

//async functions, get the request object as arguement 
createServer((request, response) => {
    let handler = methods[request.method] || notAllowed;
    handler(request)
    //request hanhdler's promise is rejected, the catch call translates the error into response object 
    .catch(error => {
        if (error.status != null) return error;
        return {body: String(error), status: 500};
    })
    //the status field of the response description may be omitted,in which case it defaults to 200. The content type is also left off
    .then(({body, status = 200, type = "text/plain"}) => {
        response.writeHead(status, {"Content-Type": type});
        if (body && body.pipe) body.pipe(response);
        //if not, it is assumed to be either null, a string or a buffer, it is also passed directly to the response's end method 
        else response.end(body);
    });
}).listen(8000);
//function that detect the invalid request: return the status code of 405 with the message 
async function notAllowed(request) {
    return {
        status: 405,
        body: `The mothod ${request.method} not supported.`
    };
}

//urlPath function uses Node's built-in url module to parse the URL to figure out which file path correspond to respond URL 
// the function takes its pathname, decodes the pathname to get rid of the %20 style escape codes, and resolves it relative to the program's working directory 
const {parse} = require("url");

//sep binding is the system's path seperator, a backslash on windows and a forward slash on most other systems
const {resolve, sep} = require("path");

//find the current working directory usign the process.cwd function
const baseDirectory = process.cwd();

function urlPath(url) {
    //the function take pathname 
    let {pathname} = parse(url);
    //resolves the path relatives to the program's working directory 
    let path = resolve(decodeURIComponent(pathname).slice(1));

    //verifies that the result is below the working directory: if the path doesn't start with the base directory, the fucntion will throw an error response object 
    if (path != baseDirectory &&
            !path.startsWith(baseDirectory + sep)) {
        //HTTP ststus code of 403 to indicate that the access to the resource is forbidden
        throw {status: 403, body: "Forbidden"};
    }
    return path;
}

// GET method 
const {createReadStream} = require("fs");
//use the stat funtion
const {stat, readdir} = require("fs").promises;
const mime = require("mime");

methods.GET = async function(request) {
    //translate the url into a file name path
    let path = urlPath(request.url);
    let stats;
    try {
        //the stat function looks up information about the file when the file doesn't exist, error code "ENOENT"
        stats = await stat(path);
        //when a requested file doesn't exist, the HTTP status code to return is 404
    } catch (error) {
        if (error.code != "ENOENT") throw error;
        else return {status: 404, body: "File not found"};
    }
    //find if the file is a directory 
    if (stats.isDirectory()) {
        //use readdir to read the array of files in a directory and return it to the client 
        return {body: (await readdir(path)).join("\n")};
    } else {
        //a readable stream with createReadStream is created and returned as the body, along with the content type that the mine package get to use 
        return {body: createReadStream(path),
                type: mime.getType(path)};
        }
};

//PUT method 
const {createWriteStream} = require("fs");
//pipeStream creates a promise around the outcome of calling pipe 
function pipeStream(from, to) {
    return new Promise((resolve, reject) => {
        //when the file has problems, createWriteStream will still return a stream 
        //this stream fires an "error" event 
        from.on("error", reject);
        //if the stream from the request falls then make both streams' error events to reject the promise 
        to.on("error", reject);
        //as pipe is done, the output stream will be closed then fire a 'finish' event also successfully resolve the promise 
        to.on("finish", resolve);
        //use pipe to move data from the request to the file 
        from.pipe(to);
    });
}
methods.PUT = async function(request) {
    //translate the url into a file name path
    let path = urlPath(request.url);
    //move data from the request to file 
    await pipeStream(request, createWriteStream(path));
    //report the status as the PUT was successful 
    return {status: 204};
};

//DELETE method 
const {rmdir, unlink} = require("fs").promises;

methods.DELETE = async function(request) {
    //trasnslate the url into a file name path 
    let path = urlPath(request.url);
    //declare the stat object called stats
    let stats;
    //wait for stat to find the file 
    try {
        stats = await stat(path);
        //handle the non-existent file name 
    } catch (error) {
        if (error.code != "ENOENT") throw error;
        //the status 204 is returned when HTTP response doesn't contain any idea 
        else return {status: 204};
    }
    //if the file name is a directory, remove it
    if (stats.isDirectory()) await rmdir(path);
    //the way to remove the file if it is not a directory 
    else await unlink(path);
    //report the status as the file deletion was successful 
    return {status: 204};
};

//MKCOL method 
const{mkdir} = require('fr').method;

methods.MKCOL = async function(request){
    //trasnslate the url into a file name path 
    let path = urlPath(request.url);
    //declare the stat object called stats
    let stats; 
    //wait for stat to find the file 
    try{
        stats = await stat(path);
        //handle non-existent file name 
    }catch (error) {
        if(error.code != 'ENDENT') throw error;
        //function to make the directory from the path 
        await mkdir(path);
        //report the status as the process of making directory was successful 
        return{status: 204 };
    }
    //if status is a directory then report the status as 204 
    if(stats.isDirectory()) return {status: 204};
    //return status quote as 400 if the directory has not yet been made 
    else return {status: 400, body:'Not a directory'};
}
