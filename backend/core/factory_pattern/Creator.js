class Creator {
    // Base method for creating a handler
    createHandler() {
        throw new Error("Method 'createHandler()' must be implemented.");
    }
}

module.exports = Creator;
