import {JSONFilePreset} from "lowdb/node";
const db = await JSONFilePreset('db.json', {robots: []});

export default async (req, res) => {
    if (req.method === 'GET') {
        const {statusId, updateId, removeId} = req.query;

        if (statusId) {
            // Вернуть текущий статус робота
            const robot = db.data.robots.find(r => r.id === parseInt(statusId));
            if (robot) {
                res.status(200).json({status: robot.status});
            } else {
                res.status(404).send('Robot not found');
            }
        } else if (updateId) {
            // Переключить статус робота
            const robot = db.data.robots.find(r => r.id === parseInt(updateId));
            if (robot) {
                robot.status = !robot.status;
                await db.write();
                res.status(200).json({status: robot.status});
            } else {
                res.status(404).send('Robot not found');
            }
        } else if (removeId) {
            // Удалить робота из базы данных
            db.data.robots = db.data.robots.filter(r => r.id !== parseInt(removeId));
            await db.write();
            res.status(200).send('Robot removed');
        } else {
            // Получить всех роботов
            res.status(200).json(db.data.robots);
        }
    } else if (req.method === 'POST') {
        // Добавить нового робота
        const {name} = req.body;
        const lastId = db.data.robots.length > 0 ? Math.max(...db.data.robots.map(r => r.id)) : 0;
        const robot = {id: lastId + 1, name: name, status: false};

        db.data.robots.push(robot);
        await db.write();

        res.status(201).json(robot);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};