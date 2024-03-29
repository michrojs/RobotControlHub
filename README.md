# RobotControlHub

Платформа удаленного управления роботами RPA, обеспечивающая гибкую и интуитивно понятную систему команд. Пользователи могут легко контролировать роботов в реальном времени.

## Начало работы

Чтобы начать работу с этим проектом, выполните следующие шаги:

### Шаг 1: Форк репозитория

1. Перейдите на страницу проекта: [RobotControlHub](https://github.com/michrojs/RobotControlHub).
2. Нажмите кнопку 'Fork' в правом верхнем углу страницы, чтобы создать копию репозитория в вашем аккаунте GitHub.

### Шаг 2: Создание проекта в Vercel и настройка базы данных

1. Зарегистрируйтесь или войдите в свой аккаунт на [Vercel](https://vercel.com/).
2. Создайте новый проект, выбрав репозиторий.
3. В разделе 'Storage' выберите 'Postgres' и следуйте инструкциям для создания базы данных.
4. В настройках хранилища PostgreSQL на Vercel предоставьте доступ к базе данных для вашего проекта.
5. В случае если происходит ошибка соединения с БД выполнить "Redeploy" проекта.

## Использование

После настройки проекта вы можете управлять роботизированными системами через веб-интерфейс, доступный по ссылке проекта на Vercel.

## Авторские права

Этот проект защищен авторскими правами. Запрещено удалять или изменять логотип и информацию об авторе.

## Локальное хранение данных с LowDB

В проекте присутствует файл `lowdb.js`, который предназначен для работы с базой данных LowDB. Это легковесная локальная база данных, идеально подходящая для использования в среде без серверных функций (Serverless).
