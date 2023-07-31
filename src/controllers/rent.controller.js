import { db } from '../database/database.connection.js'

export async function getrent(req,res){
    const rentals = await db.query("SELECT * FROM rentals");

}

export function postrent(req,res){

}

export function updaterent(req,res){

}

export function deleterents(req,res){

}
