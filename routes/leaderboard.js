import { getTopUsers } from "../data/getUsers.js";
import { Router } from "express";
const router = Router();

router.route("/")
    .get(async (req, res) => {
        let topUsers = await getTopUsers();
        return res.render("leaderboard", {users: topUsers});
    })

export default router;