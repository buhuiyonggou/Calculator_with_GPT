/**
 * the server for the DocumentHolder
 * 
 * this is an express server that provides the following routes:
 * 
 * GET /documents
 * 
 * GET /documents/:name
 * 
 * PUT /document/request/cell/:name/:cell
 * 
 * PUT /document/release/token/:name/:token
 * 
 * PUT /document/add/token/:name/:token
 * 
 * PUT /document/add/cell/:name/:cell
 * 
 * PUT /document/remove/token/:name
 * 
 * PUT /document/clear/formula/:name
 * 
 * GET /document/formula/string/:name
 * 
 * GET /document/result/string/:name
 * 
 * GET /document/editstatus/:name
 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { DocumentHolder } from '../Engine/DocumentHolder';
import { ChatManager } from '../Engine/ChatManager';
import { ChatGPTManager } from '../Engine/ChatGPTManager';
import { PortsGlobal } from '../ServerDataDefinitions';

// define a debug flag to turn on debugging
let debug = true;

// define a shim for console.log so we can turn off debugging
if (!debug) {
    console.log = () => { };
}


const app = express();
app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://pencil.local:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });
app.use(bodyParser.json());

// Add a middleware function to log incoming requests
app.use((req, res, next) => {
    if (debug) {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});




const documentHolder = new DocumentHolder();
const chatManager = new ChatManager();

// GET /documents
app.get('/documents', (req: express.Request, res: express.Response) => {
    const documentNames = documentHolder.getDocumentNames();
    res.send(documentNames);
});

// PUT /documents/:name
// userName is in the document body
app.put('/documents/:name', (req: express.Request, res: express.Response) => {
    console.log('PUT /documents/:name');
    const name = req.params.name;
    // get the userName from the body
    console.log(`PUT /documents/:name ${name}`);
    const userName = req.body.userName;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }


    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();


    if (documentNames.indexOf(name) === -1) {
        console.log(`Document ${name} not found, creating it`);
        documentHolder.createDocument(name, 5, 8, userName);
    }

    // get the document
    const document = documentHolder.getDocumentJSON(name, userName);

    res.status(200).send(document);
});

app.get('/debug', (req: express.Request, res: express.Response) => {
    debug = !debug
    console.log(`debug is ${debug}`);
    res.status(200).send(`debug is ${debug}`);

});

app.post('/documents/reset', (req: express.Request, res: express.Response) => {
    documentHolder.reset();
    res.status(200).send('reset');
});

app.post('/documents/create/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;

    // get the userName from the body
    const userName = req.body.userName;

    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        const documentOK = documentHolder.createDocument(name, 5, 8, userName);
    }
    documentHolder.requestViewAccess(name, 'A1', userName);
    const documentJSON = documentHolder.getDocumentJSON(name, userName);

    res.status(200).send(documentJSON);

});



app.put('/document/cell/edit/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;

    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name from the body
    // get the cell from the body
    const userName = req.body.userName;
    const cell = req.body.cell;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // request access to the cell
    const result = documentHolder.requestEditAccess(name, cell, userName);
    const documentJSON = documentHolder.getDocumentJSON(name, userName);

    res.status(200).send(documentJSON);
});

app.put('/document/cell/view/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;

    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name from the body
    const userName = req.body.userName;
    const cell = req.body.cell;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // request access to the cell
    const result = documentHolder.requestViewAccess(name, cell, userName);

    const documentJSON = documentHolder.getDocumentJSON(name, userName);

    res.status(200).send(documentJSON);
});

app.put('/document/addtoken/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;
    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name from the body, and get the token from the body
    const userName = req.body.userName;
    const token = req.body.token;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // add the
    const resultJSON = documentHolder.addToken(name, token, userName);


    res.status(200).send(resultJSON);
});

app.put('/document/addcell/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;


    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name  and the cell from the body
    const userName = req.body.userName;
    const cell = req.body.cell;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // add the token
    const resultJSON = documentHolder.addCell(name, cell, userName);


    res.status(200).send(resultJSON);
});

app.put('/document/removetoken/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;
    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name from the body
    const userName = req.body.userName;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // remove the tokenn
    const resultJSON = documentHolder.removeToken(name, userName);


    res.status(200).send(resultJSON);
});

// PUT /document/clear/formula/:name
app.put('/document/clear/formula/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;
    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name from the body
    const userName = req.body.userName;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // clear the formula
    const resultJSON = documentHolder.clearFormula(name, userName);

    res.status(200).send(resultJSON);
});

// GET /chat/:documentName - Fetch paged messages
app.get('/chat/:documentName', (req, res) => {
    const documentName = req.params.documentName;
    let page = 0;
    let pageSize = 20;

    if (typeof req.query.page === 'string') {
        page = parseInt(req.query.page);
    }

    if (typeof req.query.pageSize === 'string') {
        pageSize = parseInt(req.query.pageSize);
    }

    const pagedMessages = chatManager.getMessages(documentName, page, pageSize);
    res.json(pagedMessages);
});

app.post('/chat/:documentName', (req, res) => {
    const documentName = req.params.documentName;
    const { user, message } = req.body;

    if (!user || !message) {
        return res.status(400).send('User and message are required');
    }

    chatManager.addMessage(documentName, user, message);
    res.status(200).send('Message added successfully');
});

const chatGPTManager = new ChatGPTManager();

app.post('/chatgpt/:documentName', (req, res) => {
  const documentName = req.params.documentName;
  const messages = req.body;

  chatGPTManager.addMessages(documentName, messages);
  res.status(200).send('Messages added successfully');
});

app.get('/chatgpt/:documentName', (req, res) => {
  const documentName = req.params.documentName;

  const messages = chatGPTManager.getMessages(documentName);
  res.json(messages);
});

// get the port we should be using
const port = PortsGlobal.serverPort;
// start the app and test it
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
