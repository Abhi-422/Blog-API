import { jest } from '@jest/globals';

await jest.unstable_mockModule("mongoose", () => ({
    default: {
        connect: jest.fn(),
    }
}));

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

const { default: connectDB } = await import("../db/index.js"); // Adjust path
const mongoose = (await import("mongoose")).default;

describe("Database Connection Utility", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should connect to the database successfully", async () => {
        
        const mockInstance = {
            connection: { host: "localhost", name: "test-db" }
        };
        mongoose.connect.mockResolvedValue(mockInstance);

        await connectDB();

        expect(mongoose.connect).toHaveBeenCalled();
        expect(mockConsoleLog).toHaveBeenCalledWith(
            expect.stringContaining("Connected to the database")
        );
    });

    test("should log error and exit process on connection failure", async () => {
        const error = new Error("Connection failed");
        mongoose.connect.mockRejectedValue(error);

        await connectDB();

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Error connecting to the database:',
            error
        );
        // Verify that process.exit(1) was called
        expect(mockExit).toHaveBeenCalledWith(1);
    });
});
