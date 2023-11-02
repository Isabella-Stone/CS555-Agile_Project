import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import attractionRoutes from "./attractions.js";
import businessRoutes from "./business.js";

const middleware = (req, res, next) => {
  if(req.path == '/' || req.path == '/auth/login' || req.path == '/user/signup' || req.path == '/business/signup') {
    if(req.session.user) {
      res.redirect('/attractions')
    }
    else next();
  }
  else if(!req.session.user) {
    if(req.method === 'GET') {
      req.session.redirect = req.originalUrl;
      res.redirect('/auth/login');
    }
    else {
      res.status(403).json({error: 'Not logged in.'});
    }
  }
  else {
    res.locals.session = req.session;
    next();
  }
}

const constructor = (app) => {
  app.use(middleware)
  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/attractions", attractionRoutes);
  app.use("/business", businessRoutes);

  app.get("/", async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.render("landingPage", {title: "Home" });
    }
  });

  app.use("*", (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructor;