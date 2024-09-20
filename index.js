if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const wrapasync = require("./utils/wrapasync.js");

const userRouter = require("./routes/user.js");
const reviewsRouter = require("./routes/review.js");
const listingsRouter = require("./routes/listing.js");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);

const sessionOptions = {
  secret: "mysupersecrectcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Incorrect: should be a Date object
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//mongoose code
main()
  .then(() => console.log("working"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/project");
}
// app.get("/", (req, res) => {
//   res.send("heyy");
// });

// "route" files are in routes folder
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.get(
  "/search",
  wrapasync(async (req, res) => {
    const searchResults = req.query.search;
    if (
      !searchResults ||
      typeof searchResults !== "string" ||
      searchResults.trim() === ""
    ) {
      return res.redirect("/listings");
    }
    try {
      const results = await Listing.find({
        title: { $regex: searchResults.trim(), $options: "i" },
      });
      console.log(results);
      if (results.length === 0) {
        req.flash("error", "No listing found");
        return res.redirect("/listings");
      } else {
        res.render("listings/searchResults", { results, searchResults });
      }
    } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong with the search");
      return res.redirect("/listings");
    }
  })
);
app.use("/", userRouter);

// Sample search route in your Express app
// app.get("/search", async (req, res) => {
//   const searchQuery = req.query.query;

//   Check if the search query is a string and non-empty
//   if (
//     !searchQuery ||
//     typeof searchQuery !== "string" ||
//     searchQuery.trim() === ""
//   ) {
//     return res.redirect("/listings");
//   }

//   try {
//     Assuming you have a model named 'Listing' for your data
//     const results = await Listing.find({
//       title: { $regex: searchQuery.trim(), $options: "i" },
//     });

//     res.render("listings/searchResults", { results, searchQuery });
//   } catch (err) {
//     console.error(err);
//     req.flash("error", "Something went wrong with the search");
//     return res.redirect("/");
//   }
// });

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});
app.listen(3000, () => {
  console.log("server working");
});
