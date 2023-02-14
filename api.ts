import express from "npm:express@4.18.2"
import { CookieDB } from "https://deno.land/x/cookie_driver@0.5.1/mod.ts"
import { config as dotEnvConfig } from "https://deno.land/x/dotenv@v1.0.1/mod.ts"

// * updated routes for less confusion
// * /api for user accounts post, put, delete

// TODO migrate /api/confirm to GET /api

const app = express()

const cookieDB = new CookieDB(
	"https://cookiedb.com/api/db",
	dotEnvConfig().API_KEY
)

app.use(express.json())

// create table
// await cookieDB.createTable("admins", {
// 	firstName: "string",
// 	lastName: "string",
// 	school: "string",
// 	email: "string",
// 	password: "string",
// 	age: "number",
// 	verfied: "boolean",
// })

// update table schema
// await cookieDB.editTable("students", {
// 	schema: {
// 		firstName: "string",
// 		lastName: "string",
// 		school: "string",
// 		email: "string",
// 		password: "string",
// 		grade: "number",
// 		verified: "boolean",
// 	},
// })

app.post("/api", async (req, res) => {
	const data = req.body
	console.log(data)
	if (data.userType == "admin") {
		//cookiedb insert admin
		await cookieDB
			.insert("admin", {
				firstName: data.firstName,
				lastName: data.lastName,
				school: data.school,
				email: data.email,
				password: data.password,
				age: data.age,
				verified: false, //should send email for verification
			})
			.then((e) => {
				console.log(e)
				res.json("Successfull")
				console.log("Successfully posted")
			})
	} else {
		//cookiedb insert student
		await cookieDB.insert("students", {
			firstName: data.firstName,
			lastName: data.lastName,
			school: data.school,
			email: data.email,
			password: data.password,
			grade: data.grade,
			verified: false, //should send email for verification
		})
		res.json("Successfull")
	}
	//catch invalid
	res.json("Invalid")
})

app.get("/api", async (req, res) => {
	const email = req.query.email
	const userType = req.query.userType
	console.log(req.query)
	if (userType == "admin") {
		//query database for admin
		await cookieDB.select("admin", `eq($email, ${email})`).then((data) => {
			console.log(data)
			if (data) {
				console.log("yes")
				//send back ok
			} else {
				console.log("no")
				//send back not ok
			}
		})
	} else if (userType == "student") {
		//query database for student
		await cookieDB.select("students", `eq($email, '${email}')`).then((data) => {
			if (data) {
				console.log("yes")
				//send back ok
			} else {
				console.log("no")
				//send back not ok
			}
		})
	} else {
		res.json("Invalid")
	}
})

// app.post("/api/confirm", async (req, res) => {
// 	const data = req.body
// 	console.log(data)
// 	if (data.userType == "admin") {
// 		//query database for admin
// 		console.log("hi")
// 		await cookieDB
// 			.select("admin", `eq($email, '${data.email}')`)
// 			.then((data) => {
// 				if (data) {
// 					//send back ok
// 				} else {
// 					//send back not ok
// 				}
// 			})
// 	} else {
// 		//query database for student
// 		await cookieDB
// 			.select("students", `eq($email, '${data.email}')`)
// 			.then((data) => {
// 				if (data) {
// 					//send back ok
// 				} else {
// 					//send back not ok
// 				}
// 			})
// 	}
// })

app.put("/api/", async (req, res) => {})

app.delete("/api/", async (req, res) => {})

app.listen(8000, console.log("API Running on port 8000"))
