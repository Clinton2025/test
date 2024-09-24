import { Request } from "express";
import { validationResult } from "express-validator";

export default class User {

    async function register(request: Request, res: Response) {
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


function loginF(request: Request, res: Response) {
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

}