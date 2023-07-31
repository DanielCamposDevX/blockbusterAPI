import { Router } from "express"
import { getgames,postgames } from "../controllers/games.controller"

const gamesrouter = Router();



gamesrouter.get('/games',getgames);

gamesrouter.post('/games',postgames);

export default gamesrouter;