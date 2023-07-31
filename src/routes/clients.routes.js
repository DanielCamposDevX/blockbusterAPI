import { Router } from "express"
import { getclients,postclient,updateclient } from "../controllers/clients.controller"

const clientrouter = Router();



clientrouter.get('/client',getclients);

clientrouter.post('/client',postclient);

clientrouter.put('/client',updateclient);



export default clientrouter;