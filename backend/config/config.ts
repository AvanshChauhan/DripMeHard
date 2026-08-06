import dotenv from "dotenv"

dotenv.config()

type CONFIG ={
    readonly MONGO_URI:string
}

export const config:CONFIG={
    MONGO_URI:process.env.MONGO_URI!
}