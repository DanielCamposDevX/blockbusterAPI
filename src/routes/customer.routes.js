import { Router } from "express"
import { getclients,getclientid,postclient,updateclient } from "../controllers/customers.controller.js"

const clientrouter = Router();



clientrouter.get('/customers',getclients);

clientrouter.get('/customers/:id',getclientid);

clientrouter.post('/customers',postclient);

clientrouter.put('/customers/:id',updateclient);



export default clientrouter;