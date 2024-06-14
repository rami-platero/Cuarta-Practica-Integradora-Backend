import { expect } from "chai";
import supertest from "supertest";
import { config } from "../src/config/variables.config.js";

const requester = supertest(config.BASE_URL);

describe("Gaming Components app", () => {
  describe("Products API", () => {
    describe("mocking products route - GET /api/products/mockingproducts", () => {
      it("Should return 100 products successfully", async () => {
        const { statusCode, _body } = await requester.get(
          "/api/products/mockingproducts"
        );
        expect(_body.payload).to.be.ok;
        expect(_body.payload).to.have.length(100);
        expect(statusCode).is.eql(200);
      });
    });
    describe("create product - POST /api/products", () => {
      it("Should return a validation error if product title is not provided", async () => {
        const mockProduct = {
          description: "Product Description",
          code: "ABC123",
          stock: 10,
          price: 99.99,
          category: "GPU",
          status: true,
          thumbnails: [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
          ],
          owner: "user@example.com",
        };

        const { _body, statusCode } = await requester
          .post("/api/products")
          .send(mockProduct);

        expect(statusCode).is.eql(409);
        expect(_body).is.ok.and.to.have.property("error").that.is.an("array");
        const titleError = _body.error.find((e) => e.path.includes("title"));
        expect(titleError).to.not.be.undefined;
        expect(titleError).to.have.property("path").that.deep.equals(["title"]);
      });

      it("Should return an authorization error if user is not logged in", async () => {
        const mockProduct = {
          title: "Product title",
          description: "Product Description",
          code: "ABC123",
          stock: 10,
          price: 99.99,
          category: "GPU",
          status: true,
          thumbnails: [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
          ],
          owner: "user@example.com",
        };

        const { _body, statusCode } = await requester
          .post("/api/products")
          .send(mockProduct);

        expect(statusCode).is.eql(401);
        expect(_body).is.ok.and.to.have.property("error");
      });
    });
  });

  describe("Sessions API", () => {
    let cookie;

    describe("Registration route - POST /api/auth/register", () => {
      it("Should create a user successfully", async () => {
        const mockUser = {
          firstName: "Random",
          lastName: "Name",
          age: 21,
          email: "randomUser126@example.com",
          password: "Pass123456",
          confirmPassword: "Pass123456",
        };

        const { _body, statusCode } = await requester
          .post("/api/auth/register")
          .send(mockUser);

        expect(statusCode).is.eql(201);
        expect(_body.user).to.be.ok;
      });
    });

    describe("Login route - POST /api/auth/login", () => {
      it("Should login the user successfully and return a cookie", async () => {
        const mockUser = {
          email: "randomUser126@example.com",
          password: "Pass123456",
        };

        const { statusCode, headers } = await requester
          .post("/api/auth/login")
          .send(mockUser);

        const cookieResult = headers["set-cookie"][0];
        expect(cookieResult).to.be.ok;
        cookie = {
          name: cookieResult.split("=")[0],
          value: cookieResult.split("=")[1],
        };
        expect(cookie.name).to.be.ok.and.eql("jwtCookieToken");
        expect(cookie.value).to.be.ok;

        expect(statusCode).is.eql(200);
      });
    });

    describe("Current User route - GET /api/auth/current", () => {
      it("Should return the logged user successfully", async () => {
        const { _body } = await requester
          .get("/api/auth/current")
          .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(_body.user).to.be.ok;
        expect(_body.user.email).to.be.equal("randomUser126@example.com");
      });
    });
  });

  describe("Carts API", () => {
    describe("get all carts - GET /api/carts", () => {
      it("Should return all carts from DB successfully", async () => {
        const { _body, statusCode } = await requester.get("/api/carts");

        expect(statusCode).is.eql(200);
        expect(_body).is.ok.and.to.be.an("array");
      });
    });

    describe("get cart by ID - GET /api/carts/:cid/", () => {
      it("Should throw a 404 status code if cart does not exist", async () => {
        const fakeID = "507f1f77bcf86cd799439011";
        const { _body, statusCode } = await requester.get(`/api/carts/${fakeID}`);
        expect(statusCode).is.eql(404);
        expect(_body).is.ok.and.to.have.property("error");
      });
      it("Should return a cart successfully", async () => {
        const cartID = "65ee23e3ed136b6cc4bebfb5";
        const { statusCode, _body } = await requester.get(`/api/carts/${cartID}`);
        expect(statusCode).is.eql(200);
        expect(_body.payload).to.be.ok;
        expect(_body.payload).to.be.an("object");
        expect(_body.payload).to.have.property("_id").eql(cartID);
        expect(_body.payload).to.have.property("products").that.is.an("array");
      });
    });
  });
});
