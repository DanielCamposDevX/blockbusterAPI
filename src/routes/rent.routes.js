import { Router } from "express"
import { getrent,postrent,updaterent,deleterents } from "../controllers/rent.controller"

const rentrouter = Router();



rentrouter.get('/rent',getrent);

rentrouter.post('/rent',postrent);

rentrouter.put('/rent',updaterent);

rentrouter.delete('/rent',deleterents);

export default rentrouter;