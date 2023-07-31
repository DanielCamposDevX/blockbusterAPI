import { Router } from "express"
import { getrent,postrent,updaterent,deleterents } from "../controllers/rent.controller.js"

const rentrouter = Router();



rentrouter.get('/rentals',getrent);

rentrouter.post('/rentals',postrent);

rentrouter.post('/rentals/:id/return',updaterent);

rentrouter.delete('/rentals/:id',deleterents);

export default rentrouter;