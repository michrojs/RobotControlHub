import { sql } from "@vercel/postgres";

const id = 1;
const { rows } = await sql`SELECT * FROM robots WHERE id = ${id};`;

export default async (req, res) => {
    res.status(200).json(rows);
}