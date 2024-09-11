export const PORT = process.env.PORT || 9871;
export const JWT_SECRET = process.env.JWT_SECRET;
export const BASEPATH = "/api/v1";
export const DATABASES = {
    PRODUCT: "Product",
};
export const MAXAGE = 3 * 24 * 60 * 60;
export const MESSAGES = {
    DATABASE: {
        CONNECTED: "Connection to database has been established successfully",
        ERROR: "Unable to connect to database."
    },
    PRODUCT: {
        CREATED: "Product added successfully.",
        FETCHED: "Product's info fetched successfully.",
        PRODUCT_NOT_FOUND: "Product not found.",
        NO_QUERY: "Please provide the needed query."
    },
    INVALID_ID: "Id doesn't exists.",
    NOT_ID: "Not a valid object Id.",
    UNEXPECTED_ERROR: "An unexpected error occured"
}
export const ACTIONS_CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers":
        "Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Accept-Action-Version, X-Accept-Blockchain-Ids",
    "Access-Control-Expose-Headers": "X-Action-Version, X-Blockchain-Ids",
    "Content-Type": "application/json",
    "X-Action-Version": "2.1.3",
    "X-Blockchain-Ids": "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
};