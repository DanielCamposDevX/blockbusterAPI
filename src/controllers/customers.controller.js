import { db } from '../database/database.connection.js'
import { clientschema } from '../schemas/clients.schemas.js'
import dayjs from 'dayjs';

export async function getclients(req, res) {
    try {
        const customers = await db.query('SELECT name, phone, cpf, TO_CHAR(birthday, \'YYYY-MM-DD\') AS birthday FROM customers');
        return res.send(customers.rows)
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function getclientid(req, res) {
    const { id } = req.params
    try {
        const customer = await db.query('SELECT name, phone, cpf, TO_CHAR(birthday, \'YYYY-MM-DD\') AS birthday FROM customers WHERE id = $1', [id]);
        if (customer.rows.length === 0) { return res.sendStatus(404) }
        return res.send(customer.rows)
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}


export async function postclient(req, res) {
    const { name, cpf, phone, birthday } = req.body;
    const formattedBirthday = dayjs(birthday).format("YYYY-MM-DD");
    console.log(formattedBirthday)

    const client = { name, cpf, phone, birthday: formattedBirthday };
    const validation = clientschema.validate(client, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const exists = await db.query('SELECT * FROM customers WHERE cpf = $1', [cpf])
        if (exists.rows.length > 0) {
            return res.sendStatus(409);
        }
        await db.query('INSERT INTO customers (name, cpf, phone, birthday) VALUES ($1, $2, $3, $4);', [name, cpf, phone, formattedBirthday]);
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}


export async function updateclient(req, res) { 
    const { id } = req.params;
    const { name, cpf, phone, birthday } = req.body;
    const client = { name, cpf, phone, birthday };
    const validation = clientschema.validate(client, { abortEarly: false })
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    try{
    const exists = await db.query('SELECT * FROM customers WHERE cpf = $1', [cpf])
    if (exists.rows.length > 0) { return res.sendStatus(409) }
    await db.query('UPDATE usuarios SET name = $1, cpf = $2, phone = $3, birthday = $4 WHERE id = $5;', [name, cpf, phone, birthday,id])
    return(res.send)
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}
