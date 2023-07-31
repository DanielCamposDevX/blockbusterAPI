import { Router } from "express";
import rentrouter from "./rent.routes";
import clientrouter from "./clients.routes";
import gamesrouter from "./games.routes";


const router = Router();

router.use(rentrouter);
router.use(clientrouter);
router.use(gamesrouter);


export default router;