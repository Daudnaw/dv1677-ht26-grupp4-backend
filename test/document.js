
process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import server from '../db/app.js';
import { connectDB } from '../db/database.js';

// collection name
const COLL_NAME = process.env.COLLECTION_NAME;

chai.use(chaiHttp);

chai.should();

let documentId;

describe('documents', () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await connectDB();
            
            try {
                await db.collection(COLL_NAME).drop();
            } catch(error) {
                console.error(error);
            } finally {
                resolve();
            }
        });
    });

    describe('GET /api/documents', () => {
        it('200 HAPPY PATH', (done) => {
            request.execute(server)
                .get("/api/documents")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    res.body.should.have.length(0);

                    done();
                });
        });
    });

    describe('POST /api/documents', () => {
        it('201 Creating document', (done) => {
            const data = {
                titel: "doc_1",
                content: "i have one content",
            }


            request.execute(server)
                .post("/api/documents")
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("_id");

                    documentId = res.body._id;

                    done();
                });
        });

        it('200 Fetching the newly created document', (done) => {
            request.execute(server)
                .get("/api/documents")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    res.body.should.have.length(1);
                    res.body[0].should.be.an("object");
                    res.body[0].titel.should.equal("doc_1");


                    done();
                });
        });
    });

    describe('PUT /api/documents/:id', () => {
        it('200 Updating document', (done) => {
            const data = {
                titel: "doc_1 updated",
                content: "updated content",
            };

            request.execute(server)
                .put(`/api/documents/${documentId}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("_id");
                    res.body.titel.should.equal("doc_1 updated");
                    res.body.content.should.equal("updated content");

                    done();
                });
        });
    })

    describe('DELETE /api/delete/:id', () => {
        it('200 Deleting document', (done) => {
            request.execute(server)
                .delete(`/api/delete/${documentId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Document deleted");

                    done();
                });
        });
    });
});