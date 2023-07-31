import { Router } from "express";
import rentrouter from "./rent.routes.js";
import clientrouter from "./customer.routes.js";
import gamesrouter from "./games.routes.js";


const indexrouter = Router();

indexrouter.use(rentrouter);
indexrouter.use(clientrouter);
indexrouter.use(gamesrouter);


export default indexrouter;