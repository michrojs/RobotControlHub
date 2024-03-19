import { sql } from "@vercel/postgres";

export default async (req, res) => {
    // Создать таблицу, если она не существует
    await sql`CREATE TABLE IF NOT EXISTS robots (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        status BOOLEAN
    )`;

    if (req.method === 'GET') {
        const {statusId, updateId, removeId} = req.query;

        if (statusId) {
            // Вернуть текущий статус робота
            const { rows } = await sql`SELECT status FROM robots WHERE id = ${statusId}`;
            const robot = rows[0];
            if (robot) {
                res.status(200).json({status: robot.status});
            } else {
                res.status(404).send('Robot not found');
            }
        } else if (updateId) {
            // Переключить статус робота
            const { rows } = await sql`SELECT status FROM robots WHERE id = ${updateId}`;
            const robot = rows[0];
            if (robot) {
                const newStatus = !robot.status;
                await sql`UPDATE robots SET status = ${newStatus} WHERE id = ${updateId}`;
                res.status(200).json({status: newStatus});
            } else {
                res.status(404).send('Robot not found');
            }
        } else if (removeId) {
            // Удалить робота из базы данных
            await sql`DELETE FROM robots WHERE id = ${removeId}`;
            res.status(200).send('Robot removed');
        } else {
            // Получить всех роботов
            const { rows } = await sql`SELECT * FROM robots ORDER BY id ASC`;
            res.status(200).json(rows);
        }
    } else if (req.method === 'POST') {
        // Добавить нового робота
        const {name} = req.body;
        const { rows: lastIdRows } = await sql`SELECT MAX(id) as last_id FROM robots`;
        const lastId = lastIdRows[0]?.last_id || 0;
        const newRobot = {id: lastId + 1, name, status: false};

        await sql`INSERT INTO robots (id, name, status) VALUES (${newRobot.id}, ${newRobot.name}, ${newRobot.status})`;

        res.status(201).json(newRobot);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
