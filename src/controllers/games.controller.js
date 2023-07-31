import { db } from '../database/database.connection.js'
import { gameschema } from '../schemas/game.schemas.js';


export async function getgames(req, res) {
    try {
        const games = await db.query('SELECT * FROM games')
        return res.send(games.rows)
    }
    catch (err) {
        return res.status(500).send(err.message);
    }

}



export async function postgames(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;
    if(!name){return res.sendStatus(400)};
    const validation = gameschema.validate({ name, image, stockTotal, pricePerDay }, { abortEarly: false })
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    try {
        const exists = await db.query('SELECT * FROM games WHERE name = $1', [name]);
        if (exists.rows.length > 0) {
            return res.status(409).send('Already Exists');
        }
        await db.query('INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);', [name, image, stockTotal, pricePerDay]);
        return res.sendStatus(201);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}