const PayrollCreator = require("./PayrollCreator");
const RatingCreator = require("./RatingCreator");

class Factory {
    static createComponent(type) {
        switch (type) {
            case "payroll":
                return new PayrollCreator().createHandler();
            case "rating":
                return new RatingCreator().createHandler();
            default:
                throw new Error(`Unknown component type: ${type}`);
        }
    }
}

module.exports = Factory;
