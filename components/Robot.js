// Получить список всех роботов
export async function getAllRobots() {
    const response = await fetch('/api/robot');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

// Получить текущий статус робота
export async function getRobotStatus(id) {
    const response = await fetch(`/api/robot?statusId=${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

// Переключить статус робота
export async function toggleRobotStatus(id) {
    const response = await fetch(`/api/robot?updateId=${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

// Удалить робота
export async function removeRobot(id) {
    const response = await fetch(`/api/robot?removeId=${id}`, {method: 'GET'});
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.text();
}

// Добавить нового робота
export async function addRobot(name) {
    const response = await fetch('/api/robot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name}),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}