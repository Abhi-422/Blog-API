import { jest } from '@jest/globals';
import { ApiError } from "../utils/apiError.js";

// 1. Mock dependencies BEFORE imports
await jest.unstable_mockModule("jsonwebtoken", () => ({
    default: {
        verify: jest.fn()
    }
}));

await jest.unstable_mockModule("../models/user.model.js", () => ({
    User: {
        findById: jest.fn()
    }
}));

// 2. Dynamic imports
const { verifyJWT } = await import("../middlewares/auth.middleware.js"); // Adjust path if needed
const { User } = await import("../models/user.model.js");
const jwt = (await import("jsonwebtoken")).default;

describe("Auth Middleware - verifyJWT", () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.ACCESS_TOKEN_SECRET = "test-secret";
        
        req = {
            cookies: {},
            header: jest.fn().mockReturnValue(null),
        };
        res = {};
        next = jest.fn();
    });

    test("should throw 401 if no token is provided", async () => {
        await expect(verifyJWT(req, res, next)).rejects.toThrow(ApiError);
        await expect(verifyJWT(req, res, next)).rejects.toThrow("Unauthorized: No token provided");
    });

    test("should throw 401 if token is invalid", async () => {
        req.cookies.accessTocken = "invalid-token";
        jwt.verify.mockImplementation(() => {
            throw new Error("invalid signature");
        });

        await expect(verifyJWT(req, res, next)).rejects.toThrow("invalid signature");
    });

    test("should call next() and attach user to req if token is valid", async () => {
        // Mock token in header
        const mockToken = "valid-token";
        req.header.mockReturnValue(`Bearer ${mockToken}`);
        
        // Mock JWT decoding
        const decoded = { _Id: "user123" };
        jwt.verify.mockReturnValue(decoded);

        // Mock Database response (chaining .select)
        const mockUser = { _id: "user123", username: "testuser" };
        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUser)
        });

        await verifyJWT(req, res, next);

        expect(req.user).toBe(mockUser);
        expect(next).toHaveBeenCalledTimes(1);
    });

    test("should throw 401 if token is valid but user no longer exists in DB", async () => {
        req.cookies.accessTocken = "valid-token";
        jwt.verify.mockReturnValue({ _Id: "deletedUser" });
        
        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });

        await expect(verifyJWT(req, res, next)).rejects.toThrow("Unauthorized: User not found");
    });
});
