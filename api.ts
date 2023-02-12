import express from "npm:express@4.18.2"
import { CookieDB } from "https://deno.land/x/cookie_driver@0.5.1/mod.ts"

const app = express()
// Initialize instance
const cookieDB = new CookieDB(
	"https://cookiedb.com/api/db",
	"4RWuUXgRTYeEKDx6oufXdb3YdjqWfC15"
)

app.use(express.json())

//update table schema
// await cookieDB.editTable("students", {
//   schema: {
//     firstName: "string",
//     lastName: "string",
//     school: "string",
//     email: "string",
//     password: "string",
//     grade: "number",
//   },
// });

app.post("/api/", async (req, res) => {
	const data = req.body
	console.log(data)
	if (data.userType == "admin") {
		//cookiedb insert admin
		await cookieDB.insert("admin", {
			firstName: data.firstName,
			lastName: data.lastName,
			school: data.school,
			email: data.email,
			password: data.password,
			age: data.age,
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
		})
	}
	res.json("User succesfully added to database")
})

app.post("/api/confirm", async (req, res) => {
	const data = req.body
	console.log(data)
	if (data.userType == "admin") {
		//query database for admin
		console.log("hi")
		await cookieDB
			.select("admin", `eq($email, '${data.email}')`)
			.then((data) => {
				if (data) {
					//send back ok
				} else {
					//send back not ok
				}
			})
	} else {
		//query database for student
		await cookieDB
			.select("students", `eq($email, '${data.email}')`)
			.then((data) => {
				if (data) {
					//send back ok
				} else {
					//send back not ok
				}
			})
	}
})

app.put("/api/updateUser", async (req, res) => {})

app.delete("/api/deleteUser", async (req, res) => {})

app.listen(8000, console.log("API Running on port 8000"))
