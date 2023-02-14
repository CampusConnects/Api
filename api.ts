import express from "npm:express@4.18.2"
import { CookieDB } from "https://deno.land/x/cookie_driver@0.5.1/mod.ts"
import { config as dotEnvConfig } from "https://deno.land/x/dotenv@v1.0.1/mod.ts"

const app = express()
// Initialize instance
const cookieDB = new CookieDB(
	"https://cookiedb.com/api/db",
	dotEnvConfig.API_KEY
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
		res.json("Successfull")
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
		res.json("Successfull")
	}
	//catch invalid
	res.json("Invalid")
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
