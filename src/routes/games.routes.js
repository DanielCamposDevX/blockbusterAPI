import { Router } from "express"
import { getgames,postgames } from "../controllers/games.controller.js"

const gamesrouter = Router();



gamesrouter.get('/games',getgames);

gamesrouter.post('/games',postgames);

export default gamesrouter;