process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import server from '../db/app.js';

chai.use(chaiHttp);

chai.should();

describe('root', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH', (done) => {
            request.execute(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message");
                    res.body.message.should.equal("Simple mongodb api");

                    done();
                });
        });
    });
});