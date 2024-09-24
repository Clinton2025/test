"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
require("./config/db");
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.json({ limit: '100mb' }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '100mb' }));
app.listen(3000, () => {
    console.log('Server running on 3000 port');
});
app.get('/', (req, res) => {
    res.send("Hello word");
});
const sequelize_typescript_1 = require("sequelize-typescript");
const express_validator_1 = require("express-validator");
const path_1 = require("path");
const glob_1 = require("glob");
const User_1 = __importDefault(require("./model/User"));
const db = new sequelize_typescript_1.Sequelize('postgres', 'postgres', 'admin', {
    host: 'localhost',
    port: 5432,
    dialect: "postgres",
    sync: {
        force: true
    }
});
db.addModels([User_1.default]);
db.authenticate().then((data) => {
    console.log('Db connection succesfully');
}).catch((error) => {
    console.log('Database connection failed', error);
});
function getModels() {
    const modelsPath = (0, path_1.join)(__dirname, '/model');
    const files = glob_1.glob.sync(`${modelsPath}/**/*.js`);
    const models = files.map((file) => require(file).default);
    return models;
}
app.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Enter a valid Email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Enter a valid Password')
], async (request, res) => {
    const errors = (0, express_validator_1.validationResult)(request);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        const data = await User_1.default.create({ email: request.body.email, password: request.body.password });
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).send('internal server erro');
    }
});
app.post('/login', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').exists()
], async (request, res) => {
    const errors = (0, express_validator_1.validationResult)(request);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        const data = await User_1.default.findOne({ where: { email: request.body.email, password: request.body.password } });
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).send('internal server erro');
    }
});
//# sourceMappingURL=index.js.map