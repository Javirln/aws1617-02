'use strict';

const chai = require('chai');
chai.use(require('chai-things'));
chai.use(require('chai-http'));
const expect = chai.expect;
const researchers = require('../routes/researchers-service');
const tokens = require('../routes/tokens-service');
const app = require('../server');

describe('Testing Researchers API functionalities', function() {
    beforeEach(function(done) {
        researchers.connectDb((err) => {
            if (err) {
                return done(err);
            }

            researchers.removeAll(function(err) {
                if (err) {
                    return done(err);
                }

                researchers.add([{
                    orcid: "0000-0003-1575-406X",
                    name: "Manuel Resinas",
                    phone: "954553867",
                    email: "resinas@us.es",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "male"
                }, {
                    orcid: "0000-0001-9827-1834",
                    name: "Antonio Ruiz",
                    phone: "954553867",
                    email: "aruiz@us.es",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1, 2],
                    gender: "male"
                }, {
                    orcid: "0000-0002-8763-0819",
                    name: "Pablo Fernandez",
                    phone: "954556236",
                    email: "pablofm@us.es",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [2],
                    gender: "male"
                }, {
                    orcid: "0000-0001-8157-9146",
                    name: "Carlos Müller",
                    phone: "954553868",
                    email: "cmuller@lsi.us.es",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "male"
                }], done);
            });
        });
    });

    describe('#allResearchers()', function() {
        it('should return all researchers', function(done) {
            researchers.allResearchers((err, res) => {
                if (err) {
                    return done(err);
                }

                expect(res).to.have.lengthOf(4);
                expect(res).to.contain.an.item.with.property('name', 'Manuel Resinas');
                expect(res).to.contain.an.item.with.property('name', 'Antonio Ruiz');
                expect(res).to.contain.an.item.with.property('name', 'Pablo Fernandez');
                expect(res).to.contain.an.item.with.property('name', 'Carlos Müller');
                done();
            });
        });
    });

    describe('#get()', function() {
        it('should return one researcher', function(done) {
            researchers.get('0000-0003-1575-406X', (err, res) => {
                if (err) {
                    return done(err);
                }

                expect(res).to.have.lengthOf(1);
                expect(res).to.contain.an.item.with.property('name', 'Manuel Resinas');
                done();
            });
        });
    });

    describe('#add()', function() {
        it('should add one more researcher to the default list', function(done) {
            researchers.add([{
                orcid: "0000-0002-1825-0099",
                name: "Ana Gomez",
                phone: "954878584",
                email: "anagomez@us.com",
                address: "Sevilla",
                university: "US",
                group: "5921861c7233de0011769f0c",
                projects: [1],
                gender: "female"
            }], (err) => {

                if (err) {
                    return done(err);
                }

                researchers.allResearchers((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    expect(res).to.have.lengthOf(5);
                    expect(res).to.contain.an.item.with.property('name', 'Manuel Resinas');
                    expect(res).to.contain.an.item.with.property('name', 'Antonio Ruiz');
                    expect(res).to.contain.an.item.with.property('name', 'Pablo Fernandez');
                    expect(res).to.contain.an.item.with.property('name', 'Carlos Müller');
                    expect(res).to.contain.an.item.with.property('name', 'Ana Gomez');
                    done();
                });
            });
        });
    });

    describe('#removeAll()', function() {
        it('should delete all the researchers', function(done) {
            researchers.removeAll((err) => {
                if (err) {
                    return done(err);
                }

                researchers.allResearchers((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    expect(res).to.have.lengthOf(0);
                    done();
                });
            });
        });
    });

    describe('#remove()', function() {
        it('should delete one researcher of the default list', function(done) {
            researchers.remove('0000-0003-1575-406X', (err) => {
                if (err) {
                    return done(err);
                }

                researchers.allResearchers((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    expect(res).to.have.lengthOf(3);
                    expect(res).not.to.contain.an.item.with.property('name', 'Manuel Resinas');
                    expect(res).to.contain.an.item.with.property('name', 'Antonio Ruiz');
                    expect(res).to.contain.an.item.with.property('name', 'Carlos Müller');
                    expect(res).to.contain.an.item.with.property('name', 'Pablo Fernandez');
                    done();
                });
            });
        });
    });

    describe('#update()', function() {
        it('should update one researcher of the default list', function(done) {
            researchers.update('0000-0003-1575-406X', {
                orcid: "0000-0003-1575-406X",
                name: "Manuel Resinas Updated",
                phone: "954553867",
                email: "resinas@us.com",
                address: "Sevilla",
                university: "US",
                group: "5921861c7233de0011769f0c",
                projects: [1],
                gender: "male"
            }, (err) => {
                if (err) {
                    return done(err);
                }

                researchers.allResearchers((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    expect(res).to.have.lengthOf(4);
                    expect(res).to.contain.an.item.with.property('name', 'Manuel Resinas Updated');
                    expect(res).to.contain.an.item.with.property('orcid', '0000-0003-1575-406X');
                    expect(res).to.contain.an.item.with.property('name', 'Antonio Ruiz');
                    expect(res).to.contain.an.item.with.property('name', 'Carlos Müller');
                    done();
                });
            });
        });
    });
});

describe('Testing API Code status responses', function() {
    beforeEach(function(done) {
        researchers.connectDb((err) => {
            if (err) {
                return done(err);
            }

            researchers.removeAll(function(err) {
                if (err) {
                    return done(err);
                }

                researchers.add([{
                    orcid: "0000-0003-1575-406X",
                    name: "Manuel Resinas",
                    phone: "954553867",
                    email: "resinas@us.es",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "male"
                }, {
                    orcid: "0000-0001-9827-1834",
                    name: "Antonio Ruiz",
                    phone: "954553867",
                    email: "aruiz@us.es",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1, 2],
                    gender: "male"
                }, {
                    orcid: "0000-0002-8763-0819",
                    name: "Pablo Fernandez",
                    phone: "954556236",
                    email: "pablofm@us.es",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [2],
                    gender: "male"
                }, {
                    orcid: "0000-0001-8157-9146",
                    name: "Carlos Müller",
                    phone: "954553868",
                    email: "cmuller@lsi.us.es",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "male"
                }]);
            });
        });
        tokens.connectDb((err) => {
            if (err) {
                return done(err);
            }

            tokens.removeAll(function(err) {
                if (err) {
                    return done(err);
                }

                tokens.addWithToken({
                    orcid: "49561474Q",
                    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E",
                    apicalls: 0
                }, done);
            });
        });
    });

    describe('HTTP - GET all', function() {
        it('should return 200', function(done) {
            chai.request(app)
                .get('/api/v1/researchers')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E')
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    expect(res.body).to.have.lengthOf(4);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('HTTP - GET one', function() {
        it('should return 200', function(done) {
            chai.request(app)
                .get('/api/v1/researchers/0000-0003-1575-406X')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E')
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    expect(res.body).to.have.lengthOf(1);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('HTTP - GET non-existing one', function() {
        it('should return 404', function(done) {
            chai.request(app)
                .get('/api/v1/researchers/0000-0003-0000-4067')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E')
                .end(function(err, res) {
                    if (err && res.status === 404) {
                        expect(res).to.have.status(404);
                        done();
                    }
                    else {
                        return done(err);
                    }
                });
        });
    });

    describe('HTTP - POST new researcher', function() {
        it('should return 201', function(done) {
            chai.request(app)
                .post('/api/v1/researchers/')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E')
                .send({
                    orcid: "0000-0002-1825-0099",
                    name: "Ana Gomez",
                    phone: "954878584",
                    email: "anagomez@us.com",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "female"
                })
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    expect(res).to.have.status(201);
                    done();
                });
        });
    });

    describe('HTTP - POST over existing researcher', function() {
        it('should return 409', function(done) {
            chai.request(app)
                .post('/api/v1/researchers/')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E')
                .send({
                    orcid: "0000-0001-9827-1834",
                    name: "Antonio Ruiz",
                    phone: "954553867",
                    email: "aruiz@us.es",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "female"
                })
                .end(function(err, res) {
                    if (err && res.status === 409) {
                        expect(res).to.have.status(409);
                        done();
                    }
                    else {
                        return done(err);
                    }
                });
        });
    });

    describe('HTTP - PUT existing researcher', function() {
        it('should return 200', function(done) {
            chai.request(app)
                .put('/api/v1/researchers/0000-0001-9827-1834')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E')
                .send({
                    orcid: "0000-0001-9827-1834",
                    name: "NewAntonio Ruiz",
                    phone: "987654322",
                    email: "newAntonio Ruiz@us.com",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "female"
                })
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('HTTP - PUT non-existing researcher', function() {
        it('should return 404', function(done) {
            chai.request(app)
                .put('/api/v1/researchers/11224455V')
                .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E')
                .send({
                    orcid: "0000-0001-9827-1834",
                    name: "NewAntonio Ruiz",
                    phone: "987654322",
                    email: "newAntonio Ruiz@us.com",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "female"
                })
                .end(function(err, res) {
                    if (err && res.status === 404) {
                        expect(res).to.have.status(404);
                        done();
                    }
                    else {
                        return done(err);
                    }
                });
        });
    });

    /* WITHOUT TOKEN */

    describe('HTTP - GET all unauthorized', function() {
        it('should return 401', function(done) {
            chai.request(app)
                .get('/api/v1/researchers')
                .end(function(err, res) {
                    if (err && res.status === 401) {
                        expect(res).to.have.status(401);
                        done();
                    }
                    else {
                        return done(err);
                    }
                });
        });
    });

    describe('HTTP - GET all token invalid', function() {
        it('should return 401', function(done) {
            chai.request(app)
                .get('/api/v1/researchers')
                .set('Authorization', 'Bearer ThisIsABadToken')
                .end(function(err, res) {
                    if (err && res.status === 401) {
                        expect(res).to.have.status(401);
                        done();
                    }
                    else {
                        return done(err);
                    }
                });
        });
    });

    describe('HTTP - GET one unauthorized', function() {
        it('should return 401', function(done) {
            chai.request(app)
                .get('/api/v1/researchers/0000-0003-1575-406X')
                .end(function(err, res) {
                    if (err && res.status === 401) {
                        expect(res).to.have.status(401);
                        done();
                    }
                    else {
                        return done(err);
                    }
                });
        });
    });

    describe('HTTP - GET one token invalid', function() {
        it('should return 401', function(done) {
            chai.request(app)
                .get('/api/v1/researchers/0000-0003-1575-406X')
                .set('Authorization', 'Bearer ThisIsABadToken')
                .end(function(err, res) {
                    if (err && res.status === 401) {
                        expect(res).to.have.status(401);
                        done();
                    }
                    else {
                        return done(err);
                    }
                });
        });
    });

    describe('HTTP - POST new researcher unauthorized', function() {
        it('should return 401', function(done) {
            chai.request(app)
                .post('/api/v1/researchers/')
                .send({
                    orcid: "0000-0002-1825-0099",
                    name: "Manuel",
                    phone: "954553867",
                    email: "manuel@us.com",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "male"
                })
                .end(function(err, res) {
                    if (err && res.status === 401) {
                        expect(res).to.have.status(401);
                        done();
                    }
                    else {
                        return done(err);
                    }
                });
        });
    });

    describe('HTTP - POST new researcher token invalid', function() {
        it('should return 401', function(done) {
            chai.request(app)
                .post('/api/v1/researchers/')
                .set('Authorization', 'Bearer ThisIsABadToken')
                .send({
                    orcid: "0000-0002-1825-0099",
                    name: "Manuel",
                    phone: "954553867",
                    email: "manuel@us.com",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "male"
                })
                .end(function(err, res) {
                    if (err && res.status === 401) {
                        expect(res).to.have.status(401);
                        done();
                    }
                    else {
                        return done(err);
                    }
                });
        });
    });

    describe('HTTP - PUT existing researcher unauthorized', function() {
        it('should return 401', function(done) {
            chai.request(app)
                .put('/api/v1/researchers/0000-0001-9827-1834')
                .send({
                    orcid: "0000-0001-9827-1834",
                    name: "NewAntonio Ruiz",
                    phone: "987654322",
                    email: "newAntonio Ruiz@us.com",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "female"
                })
                .end(function(err, res) {
                    if (err && res.status === 401) {
                        expect(res).to.have.status(401);
                        done();
                    }
                    else {
                        return done(err);
                    }
                });
        });
    });

    describe('HTTP - PUT existing researcher token invalid', function() {
        it('should return 401', function(done) {
            chai.request(app)
                .put('/api/v1/researchers/0000-0001-9827-1834')
                .set('Authorization', 'Bearer ThisIsABadToken')
                .send({
                    orcid: "0000-0001-9827-1834",
                    name: "NewAntonio Ruiz",
                    phone: "987654322",
                    email: "newAntonio Ruiz@us.com",
                    address: "Sevilla",
                    university: "US",
                    group: "5921861c7233de0011769f0c",
                    projects: [1],
                    gender: "female"
                })
                .end(function(err, res) {
                    if (err && res.status === 401) {
                        expect(res).to.have.status(401);
                        done();
                    }
                    else {
                        return done(err);
                    }
                });
        });
    });


});
