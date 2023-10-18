import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import attractionRoutes from "./attractions.js";
import businessRoutes from "./business.js";

const constructor = (app) => {
  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/attraction", attractionRoutes);
  app.use("/business", businessRoutes);

  app.get("/", async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.render("landingPage", { auth: false, title: "Home" });
    }
    try {

    } catch (e) {
      return res.status(500).render("landingPage", { error: e, body: e});
    }
    return res.render("main", {
        title: "Home",
        body: "Logged in",
        auth: true,
        id: req.session.user.id
    });
  });

  app.use("*", (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructor;