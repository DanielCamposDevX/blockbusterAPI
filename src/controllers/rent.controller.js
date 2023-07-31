import { db } from '../database/database.connection.js'
import { rentschema } from '../schemas/rental.schemas.js';
import dayjs from 'dayjs';

export async function getrent(req, res) {
    try {
        const query = `
        SELECT 
          rentals.*,
          customers.name AS customer_name,
          games.name AS game_name
            FROM rentals
            INNER JOIN customers ON rentals."customerId" = customer
            INNER JOIN games ON rentals."gameId" = game;
      `;
        const rentals = await db.query(query);

        res.send(rentals.rows);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}



export async function postrent(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    if (daysRented < 1) { return res.sendStatus(400); }
    const validation = rentschema.validate({ customerId, gameId, daysRented }, { abortEarly: false })
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    try {
        const exists = await db.query('SELECT * FROM customers WHERE id = $1', [customerId])
        if (exists.rows.length == 0) { return res.sendStatus(400) }
        const price = await db.query('SELECT * FROM games WHERE id = $1', [gameId])
        if (price.rows.length == 0) { return res.sendStatus(404) }
        const originalPrice = price.pricePerDay * daysRented;
        const rentDate = dayjs().format('YYYY-MM-DD')
        const returnDate = null;
        await db.query('INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES($1,$2,$3,$4,$5,$6,$7)'[customerId, gameId, rentDate, daysRented, returnDate, originalPrice, returnDate])
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function updaterent(req, res) {
    const { id } = req.params;
    const today = dayjs().format('YYYY-MM-DD')
    try{
        const rent = await db.query('SELECT * FROM rentals WHERE id = $1', [id])
        if(rent.rows.length == 0){ return res.sendStatus(404)}
        if(rent.rows.returnDate != null){return res.sendStatus(400)}
        const rentDate = rent.rows.date;
        const daysRented = rent.rows.rentDate;
        const days = today.diff(rentDate, 'day')
        const fee = 0
        if(days > daysRented){
           fee = (days - daysRented) * (rent.rows.originalPrice / daysRented)
        }
        await db.query('UPDATE rentals SET returnDate = $1,delayFee = $2 WHERE id = $3'[today,fee,id])
    }
    catch (err) {
        return res.status(500).send(err.message);
    }   
}

export async function deleterents(req, res) {
    const { id } = req.params;
    try{
    const exists = await db.query('SELECT * FROM rentals WHERE id = $1', [id])
    if(exists.rows.length == 0){ return res.sendStatus(404)};
    if(exists.rows.returnDate == null){ return res.sendStatus(400);}
    await db.query('DELETE FROM rentals WHERE id = $1', [id])
    }
    catch (err) {
        return res.status(500).send(err.message);
    }  
}
