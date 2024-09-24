"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Enter a valid Email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Enter a valid Password')
], async (request, res) => {
    const errors = (0, express_validator_1.validationResult)(request);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    console.log(request.body);
});
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').exists()
]);
//# sourceMappingURL=index.js.map