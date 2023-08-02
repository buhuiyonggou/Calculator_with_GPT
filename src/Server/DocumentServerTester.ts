import axios from 'axios';
import fs from 'fs';
import path from 'path';


// this will run a bunch of tests against the server.

// the server should be running on theport in PortsGlobal.ts

import { PortsGlobal } from '../PortsGlobal';

const serverPort = PortsGlobal.serverPort;

const baseURL = `http://localhost:${serverPort}`;

function cleanFiles() {
    return axios.post(`${baseURL}/documents/reset`)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function getDocuments() {
    return axios.get(`${baseURL}/documents`)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function createDocument(name: string, user: string) {
    // put the user name in the body
    const userName = user;

    return axios.post(`${baseURL}/documents/create/${name}`, { "userName": userName })
        .then(response => {
            const result = response.data;
            return result;
        });
}

function getDocument(name: string) {
    return axios.get(`${baseURL}/documents/${name}`)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function addToken(docName: string, token: string, user: string) {
    // put the user name in the body
    const userName = user;
    return axios.put(`${baseURL}/document/addtoken/${docName}/${token}`, { "userName": userName })
        .then(response => {
            const result = response.data;
            return result;
        });
}

function addCell(docName: string, cell: string, user: string) {
    // put the user name in the body
    const userName = user;
    return axios.put(`${baseURL}/document/addcell/${docName}/${cell}`, { "userName": userName })
        .then(response => {
            const result = response.data;
            return result;
        });
}

function requestEditCell(docName: string, cell: string, user: string): Promise<boolean> {
    // put the user name in the body
    const userName = user;
    return axios.put(`${baseURL}/document/cell/edit/${docName}/${cell}`, { "userName": userName })
        .then(response => {
            const result = response.data;
            return result;
        });
}


// this is the main function that runs the tests
async function runTests() {

    cleanFiles();
    // first, create a document
    const testDocument1 = 'xxxtestDocument1';
    const testDocument2 = 'xxxtestDocument2';
    const testDocument3 = 'xxxtestDocument3';

    const user1 = 'juancho';
    const user2 = 'yvonne';
    const user3 = 'jose';


    await createDocument(testDocument1, user1);
    await createDocument(testDocument2, user2);
    await createDocument(testDocument3, user3);

    // first, get the list of documents
    const documents = await getDocuments();
    console.log('documents', documents);

    // ask for a cell in the first document for user1

    const cell1 = 'A1';
    const cell2 = 'B2';

    let result = await requestEditCell(testDocument1, cell1, user1);
    result = await addToken(testDocument1, '1', user1);
    result = await addToken(testDocument1, '2', user1);
    result = await addToken(testDocument1, '+', user1);
    result = await addCell(testDocument1, cell2, user1);

    result = await requestEditCell(testDocument1, cell2, user2);


}

// call the test runner

runTests();