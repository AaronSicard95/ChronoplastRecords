const request = require("supertest");
const app = require("../app");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, adminToken } = require("./_testCommon");


beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /auth/register", function(){
    test("register works", async function(){
        const resp = await request(app)
        .post("/auth/register")
        .send({
            username: "newUser",
            password: "newPassword",
            handle: "newUser",
            email: "me@p.com",
            first_name: "amazing",
            last_name: "person"
        });
        expect(resp.body).toEqual({
            "token": expect.any(String)
        });
    });
});

describe("POST /auth/register/admin", function(){
    test("register admin doesn't work for anon", async function(){
        const resp = await request(app)
        .post("/auth/register/admin")
        .send({
            username: "newUser",
            password: "newPassword",
            handle: "newUser",
            email: "me@p.com",
            first_name: "amazing",
            last_name: "person"
        });
        expect(resp.statusCode).toEqual(401);
    });

    
    test("register admin works for admin", async function(){
        const resp = await request(app)
        .post("/auth/register/admin")
        .set("authorization", `${adminToken}`)
        .send({
            username: "newUser2",
            password: "newPassword",
            handle: "newUser",
            email: "me@p.com",
            first_name: "amazing",
            last_name: "person",
            passCheck:"password"
        });
        console.log(resp);
        expect(resp.statusCode).toEqual(201);
    });
});