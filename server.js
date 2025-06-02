/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const dotenv = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoutes")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")


/* ***********************
 * View Engine and Template
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout") //not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
//index route
app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", inventoryRoute)

// FIle not found
app.use(async (req, res, next) => {
  next({
    status: 404, 
    message: 'This is not the page you are looking for.'
  })
})

/* ***********************
* Express Error Handler
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404) {message = err.message} else {message = 'Oops, looks like something went wrong! Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || '500 Server Error',
    message,
    nav,
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`);
});
