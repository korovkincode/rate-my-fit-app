import { useContext, useState, Dispatch, SetStateAction, ChangeEvent, FormEvent } from 'react';
import { AuthContext } from '../context';
import { SnackbarStatus } from '../types/UI';
import { Box, Avatar, Grid, Typography, TextField, Button, IconButton, Card, CardHeader, CardMedia, CardActions } from '@mui/material';
import { AddAPhoto, Close, CloudUpload } from '@mui/icons-material';
import { Form, FormType } from '../types/fit';
import { capitalize, lastElement, getTodayDate } from '../utils';
import Stepper from './UI/stepper';
import { addFit } from '../API/fit';

const FitForm = ({ actionType, openSetter, snackbarSetter }: {
    actionType: FormType, openSetter: Dispatch<SetStateAction<boolean>>, snackbarSetter: Dispatch<SetStateAction<SnackbarStatus>>
}) => {

    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not defined');
    }
    const [userCredentials, setUserCredentials] = authContext;

    const [fitData, setFitData] = useState<Form>({
        title: '', description: null, pics: []
    });

    const [galleryIndex, setGalleryIndex] = useState<number>(0);

    const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
        if (fitData.pics.length == 4) {
            snackbarSetter({
                open: true, message: 'Maximum 4 images can be attached', color: 'error'
            });
        } else if (event.target.files) {
            setFitData({
                ...fitData, pics: fitData.pics.concat([lastElement(Array.from(event.target.files))])
            });
            setGalleryIndex(fitData.pics.length);
        }
    };
    
    const removeFile = (index: number) => {
        const newpics = fitData.pics;
        newpics.splice(index, 1);
        setFitData({
            ...fitData, pics: newpics
        });
        if (galleryIndex) setGalleryIndex(galleryIndex - 1);
    };

    const handleForm = async (event: FormEvent) => {
        event.preventDefault();
        if (fitData.title === '' || fitData.pics.length === 0) {
            snackbarSetter({
                open: true, message: 'Fill in all fields', color: 'error'
            });
            return;
        }

        const requestBody = {
            userCredentials: userCredentials, title: fitData.title, description: fitData.description,
            date: getTodayDate(), itemsID: [], fitID: null, authorToken: null, picnames: null
        }
        const formData = new FormData();
        formData.append('fitData', JSON.stringify(requestBody));
        fitData.pics.forEach((pic, index) => {
            formData.append('pics', new File([pic], pic.name));
        });

        const formResponse = await addFit(formData);

        if (formResponse.status !== 200) {
            snackbarSetter({
                open: true, message: formResponse.description, color: 'error'
            });
            return;
        }
        openSetter(false);
        snackbarSetter({
            open: true, message: formResponse.message, color: 'success'
        });
        setUserCredentials({
            ...userCredentials, reloader: Math.random() * 1000
        });
    };

    return (
        <Box component="form" noValidate sx={{
           display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
            <IconButton
                onClick={() => openSetter(false)}
                sx={{ position: 'absolute', top: '10px', 'right': '15px' }}
            >
                <Close />
            </IconButton>
            <Avatar sx={{ bgcolor: 'primary.main', width: '64px', height: '64px', mt: 2 }}>
                <AddAPhoto />
            </Avatar>
            <Typography sx={{ mt: 2, fontWeight: 700 }} component="h1" variant="h5">
                {capitalize(actionType)} fit
            </Typography>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required value={fitData.title} onChange={e => setFitData({...fitData, title: e.target.value})}
                        fullWidth label="Title" placeholder={actionType === 'add' ? 'Choose a title' : 'Enter new title'}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        value={fitData.description} onChange={e => setFitData({...fitData, description: e.target.value})}
                        fullWidth label="Description" placeholder="Choose a description"
                    />
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        component="label" variant="contained" tabIndex={0} startIcon={<CloudUpload />}
                        sx={{ mt: 1, borderRadius: 6 }}
                    >
                        Upload pics
                        <input type="file" multiple hidden onChange={(e) => handleFile(e)} />
                    </Button>
                </Grid>
                {fitData.pics.length > 0 && (
                    <>
                        <Box sx={{
                            display: 'flex', flexDirection: 'column', ml: 'auto', mr: 'auto'
                        }}>
                            <Card sx={{ borderRadius: 5, boxShadow: 3 }}>
                                <CardHeader
                                    slotProps={{ title: {fontSize: 18, fontWeight: 700} }}
                                    title={fitData.pics[galleryIndex].name}
                                />
                                <CardMedia
                                    sx={{ maxWidth: '300px', maxHeight: '300px' }}
                                    component="img" alt={`${galleryIndex + 1} - ${fitData.pics[galleryIndex].name}`}
                                    image={URL.createObjectURL(fitData.pics[galleryIndex])}
                                />
                                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        color="error" variant="contained"
                                        sx={{ borderRadius: 3, mr: 0.5 }}
                                        onClick={() => removeFile(galleryIndex)}   
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                            <Stepper
                                length={fitData.pics ? fitData.pics.length : 0}
                                step={galleryIndex} setter={setGalleryIndex}
                            />
                        </Box>
                    </>
                )}
            </Grid>
            <Button
                type="submit" variant="contained" sx={{ width: '70%', borderRadius: 3, mt: 3, mb: 2 }}
                onClick={handleForm}
            >
                {capitalize(actionType)}
            </Button>
        </Box>
    );
};

export default FitForm;