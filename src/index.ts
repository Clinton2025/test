import express, { Request, Response } from "express";
const app = express();
import "./config/db";
import bodyParser from "body-parser";
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
import jwt from "jsonwebtoken";

import { Sequelize } from "sequelize-typescript";
import { body, validationResult } from "express-validator";
import { join } from "path";
import { glob } from "glob";
import User from "./model/User";
import multer from "multer";
import xlsx from "xlsx";

app.listen(3000, () => {
    console.log('Server running on 3000 port')
})

app.get('/', (req, res: Response) => {
    res.send("Hello word")
})


const db = new Sequelize('postgres', 'postgres', 'admin', {
    host: 'localhost',
    port: 5432,
    dialect: "postgres",
    sync: {
        // alter: true,
        force: true
    }
})
db.addModels([User]);

db.authenticate().then((data) => {
    console.log('Db connection succesfully')
}).catch((error: Error) => {
    console.log('Database connection failed', error)
})

function getModels() {
    const modelsPath = join(__dirname, '/model');
    const files = glob.sync(`${modelsPath}/**/*.js`);
    const models = files.map((file) => require(file).default);
    return models;
}



app.post('/register',
    [
        body('email').isEmail().withMessage('Enter a valid Email'),
        body('password').isLength({ min: 6 }).withMessage('Enter a valid Password')],

    async (request: Request, res: Response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        try {
            const data = await User.create({ email: request.body.email, password: request.body.password })
            const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' })
            res.status(200).json({ ...data, token: token })
        } catch (error) {
            res.status(500).send('internal server erro')
        }
    }
)

app.post('/login',
    [
        body('email').isEmail(),
        body('password').exists()],

    async (request: Request, res: Response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        try {
            const data: any = await User.findOne({ where: { email: request.body.email, password: request.body.password } })
            const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' })
            res.status(200).json({ ...data, token: token })
        } catch (error) {
            res.status(500).send('internal server erro')
        }
    }
)

const upload = multer({ dest: 'uploads/' })

app.post('/import', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: "No file content" })
    }

    const workbook: any = xlsx.readFile(req.file.path)
    const sheet: any = workbook.SheetNames;
    const data: any = xlsx.utils.sheet_to_json(workbook.Sheets[sheet[0]])

    try {
        for (const chat of data) {
            await db.query('INSERT INTO Chat (sender, message) VALUES($1, $2)')
        }
        res.status(200).json({ msg: "data inserted succesfully" })
    } catch (error) {
        console.log('Error', error)
        res.status(500).send('Internal server error')
    }
})