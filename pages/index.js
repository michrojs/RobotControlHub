import {useEffect, useState} from 'react';
import {Box, Button, IconButton, Radio, TextField, Typography} from "@mui/material";
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Image from "next/image";
import logo from "/public/logo.svg";
import {addRobot, getAllRobots, removeRobot, toggleRobotStatus} from "@/components/Robot";
import {enqueueSnackbar, SnackbarProvider} from "notistack";

export default function Home() {
    const [newRobotName, setNewRobotName] = useState("");
    const [robots, setRobots] = useState([]);

    console.log(process.env.POSTGRES_URL);

    useEffect(() => {
        getAllRobots().then(data => {
            setRobots(data);
        }).catch(error => {
            enqueueSnackbar('Ошибка при получении роботов.', {variant: 'error'})
        });
    }, []);

    const handleChange = (event) => {
        setNewRobotName(event.target.value);
    };

    // Обработчик отправки формы
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const newRobot = await addRobot(newRobotName);
            setRobots(prevRobots => [...prevRobots, newRobot]);
            setNewRobotName("");
        } catch (error) {
            enqueueSnackbar('Ошибка при добавлении робота.', {variant: 'error'})
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const updatedRobot = await toggleRobotStatus(id);
            setRobots(prevRobots => {
                return prevRobots.map(robot => {
                    if (robot.id === id) {
                        return updatedRobot;
                    }
                    return robot;
                });
            });
            const freshRobots = await getAllRobots();
            setRobots(freshRobots);
        } catch (error) {
            enqueueSnackbar('Ошибка при переключении статуса.', {variant: 'error'})
        }
    }

    const handleRemoveRobot = async (id) => {
        try {
            await removeRobot(id);
            // Обновление состояния для отражения изменений
            setRobots(prevRobots => prevRobots.filter(robot => robot.id !== id));
        } catch (error) {
            enqueueSnackbar('Ошибка при удалении робота.', {variant: 'error'})
        }
    };

    function copyToClipboard(id) {
        const href = window.location.href;
        const url = "checkStatus:\t" + href + "api/robot?statusId=" + id + "\nchangeStatus:\t" + href + "api/robot?updateId=" + id;
        navigator.clipboard.writeText(url).then(() => {
            enqueueSnackbar("Ссылка на API скопирована в буфер обмена", {variant: 'success'})
        }).catch(err => {
            enqueueSnackbar('Ошибка при копировании в буфер обмена.', {variant: 'error'})
        });
    }

    return (
        <div>
            <SnackbarProvider preventDuplicate anchorOrigin={{vertical: 'top', horizontal: 'center'}}/>
            <Box
                display="flex"
                justifyContent="center"
                minWidth="100vw"
                minHeight="100vh"
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    width="100%"
                    maxWidth={800}
                    bgcolor="white"
                >
                    <Image src={logo} alt="Логотип" width={200}/>
                    <Box
                        width="100%"
                        padding={3}
                    >
                        <TextField label="Название робота" variant="outlined" size={"small"}
                                   sx={{width: "calc(100% - 115px)", borderColor: "red"}} onChange={handleChange}
                                   value={newRobotName} color="error" focused/>
                        <Button variant="contained" sx={{
                            width: "100px",
                            marginLeft: "15px",
                            backgroundColor: "#DE002B",
                            '&:hover': {backgroundColor: "#C80027"}
                        }} onClick={handleSubmit}>Добавить</Button>
                    </Box>
                    <Typography variant="h6" sx={{marginTop: "15px"}}>Добавленные роботы</Typography>
                    {robots.length > 0
                        ? robots.map((item, index) => (
                            <>
                                <Box
                                    width="100%"
                                    padding={3}
                                >
                                    <Radio checked={true} sx={{
                                        '&.Mui-checked': {color: item.status ? "#2B8600" : "#DE002B"},
                                        padding: "0px"
                                    }}/>
                                    <TextField variant="standard" sx={{width: "calc(100% - 135px)", paddingLeft: "5px"}}
                                               value={item.name} color={item.status ? "success" : "error"} focused/>
                                    <IconButton aria-label="stop" sx={{fontSize: "33px", padding: "1px"}}
                                                onClick={() => handleToggleStatus(item.id)}>
                                        {item.status ? <StopIcon fontSize={"inherit"}/> :
                                            <PlayArrowIcon fontSize={"inherit"}/>}
                                    </IconButton>
                                    <IconButton aria-label="delete" sx={{padding: "7px"}}
                                                onClick={() => handleRemoveRobot(item.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                    <IconButton aria-label="copy" sx={{padding: "7px"}}
                                                onClick={() => copyToClipboard(item.id)}>
                                        <FileCopyIcon/>
                                    </IconButton>
                                </Box>
                            </>
                        ))
                        : <></>
                    }
                    <Typography variant="body1" textAlign="center"
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "end",
                                    marginBottom: "10px"
                                }}>Created
                        by Mikhail Kaletin,<br/>January 2024.</Typography>
                </Box>
            </Box>
        </div>
    );
}