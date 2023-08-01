import { db } from '../database/database.connection.js'
import { rentschema } from '../schemas/rental.schemas.js';
import dayjs from 'dayjs';

export async function getrent(req, res) {
    try {
        const query = `
        SELECT
          r.id,
          r."customerId",
          r."gameId",
          TO_CHAR(r."rentDate", 'YYYY-MM-DD') as "rentDate",
          r."daysRented",
          TO_CHAR(r."returnDate", 'YYYY-MM-DD') as "returnDate",
          r."originalPrice",
          r."delayFee",
          c.id AS "customer.id",
          c.name AS "customer.name",
          g.id AS "game.id",
          g.name AS "game.name"
        FROM rentals r
        JOIN customers c ON r."customerId" = c.id
        JOIN games g ON r."gameId" = g.id;`;
        const { rows: rentals } = await db.query(query);
        const modifiedRentals = rentals.map((rental) => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate,
            daysRented: rental.daysRented,
            returnDate: rental.returnDate,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
                id: rental["customer.id"],
                name: rental["customer.name"],
            },
            game: {
                id: rental["game.id"],
                name: rental["game.name"],
            },
        }));

        res.send(modifiedRentals);
    } catch (err) {
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
        const pricePerDay = price.rows[0].pricePerDay;
        const originalPrice = pricePerDay * daysRented;
        const rentDate = dayjs().format('YYYY-MM-DD')
        const returnDate = null;
        await db.query('INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES($1,$2,$3,$4,$5,$6,$7)', [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, returnDate]);
        return res.sendStatus(201);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function updaterent(req, res) {
    const { id } = req.params;
    const today = dayjs();
    try {
        const rent = await db.query('SELECT * FROM rentals WHERE id = $1', [id])
        if (rent.rows.length == 0) { return res.sendStatus(404) }
        if (rent.rows.returnDate != null) { return res.sendStatus(400) }
        const rentDate = dayjs(rent.rows.date);
        const daysRented = rent.rows.rentDate;
        const days = today.diff(rentDate, 'day');
        let fee = 0;
        if (days > daysRented) {
            fee = (days - daysRented) * (rent.rows.originalPrice / daysRented);
        }
        await db.query('UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3', [today.format('YYYY-MM-DD'), fee, id]);
        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function deleterents(req, res) {
    const { id } = req.params;
    try {
        const exists = await db.query('SELECT * FROM rentals WHERE id = $1', [id])
        if (exists.rows.length == 0) { return res.sendStatus(404) };
        if (exists.rows[0].returnDate == null) { return res.sendStatus(400); }
        await db.query('DELETE FROM rentals WHERE id = $1', [id])
        return res.sendStatus(200)
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}
