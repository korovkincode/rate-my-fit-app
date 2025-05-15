import { useContext, useState, useRef, Dispatch, SetStateAction, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { AuthContext } from '../context';
import { SnackbarStatus } from '../types/UI';
import { Box, Avatar, Grid, Typography, TextField, Button, IconButton, Card, CardHeader, CardMedia, CardActions, InputAdornment, Paper } from '@mui/material';
import { AddAPhoto, Close, CloudUpload, Search } from '@mui/icons-material';
import { Form, FormType } from '../types/fit';
import { capitalize, lastElement, getTodayDate, convertItemsList } from '../utils';
import Stepper from './UI/stepper';
import { addFit } from '../API/fit';
import { Item } from '../types/item';
import { searchItemName } from '../API/item';
import ItemsTable from './ItemsTable';

interface FitFormProps {
    actionType: FormType,
    openSetter: Dispatch<SetStateAction<boolean>>,
    snackbarSetter: Dispatch<SetStateAction<SnackbarStatus>>
};

const FitForm = ({ actionType, openSetter, snackbarSetter }: FitFormProps) => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not defined');
    }
    const [userCredentials, setUserCredentials] = authContext;

    const [fitData, setFitData] = useState<Form>({
        title: '', description: null, pics: [], itemsID: []
    });
    const titleBar = useRef<HTMLInputElement>(null);
    const descriptionBar = useRef<HTMLInputElement>(null);

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

    const searchBar = useRef<HTMLInputElement>(null);
    const [queryItems, setQueryItems] = useState<Item[] | null>(null);
    const [itemsCache, setItemsCache] = useState<{[itemID: string]: Item}>({});

    const searchItems = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const itemName = searchBar.current?.value;
        if (!itemName) {
            snackbarSetter({
                open: true, message: 'Item name cannot be null', color: 'error'
            });
            return;
        }

        const searchRequest = await searchItemName(itemName, 200);
        if (searchRequest.status !== 200) {
            snackbarSetter({
                open: true, message: searchRequest.description, color: 'error'
            });
            throw new Error(searchRequest.description);
        }

        setQueryItems(searchRequest.data);
    };

    const chooseItem = (itemData: Item) => {
        setItemsCache({
            ...itemsCache, [itemData.itemID]: itemData
        });
        setFitData({
            ...fitData, itemsID: fitData.itemsID.concat([itemData.itemID])
        });
        setQueryItems(null);
        snackbarSetter({
            open: true, message: 'Successfully added the item', color: 'success'
        });
    };

    const removeItem = (itemData: Item) => {
        const itemIndex = fitData.itemsID.indexOf(itemData.itemID);
        fitData.itemsID.splice(itemIndex, 1);
        setFitData(fitData);

        delete itemsCache[itemData.itemID];
        setItemsCache(itemsCache);
        
        snackbarSetter({
            open: true, message: 'Successfully removed the item', color: 'success'
        });
    };

    const handleForm = async (event: FormEvent) => {
        event.preventDefault();
        fitData.title = titleBar.current?.value || '';
        fitData.description = descriptionBar.current?.value || '';
        setFitData(fitData);
        if (fitData.title === '' || fitData.pics.length === 0) {
            snackbarSetter({
                open: true, message: 'Fill in all fields', color: 'error'
            });
            return;
        }

        const requestBody = {
            userCredentials: userCredentials, title: fitData.title, description: fitData.description,
            date: getTodayDate(), itemsID: fitData.itemsID, totalPrice: 0, totalReviews: 0, avgGrade: 0
        };
        const formData = new FormData();
        formData.append('fitData', JSON.stringify(requestBody));
        fitData.pics.forEach((pic, _) => {
            formData.append('pics', new File([pic], pic.name));
        });

        let formResponse;
        if (actionType === 'add') {
            formResponse = await addFit(formData);
        } else if (actionType == 'update') {

        }

        if (formResponse.status !== 200) {
            snackbarSetter({
                open: true, message: formResponse.description, color: 'error'
            });
            throw new Error(formResponse.description);
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
                        inputRef={titleBar} required fullWidth
                        label="Title" placeholder={actionType === 'add' ? 'Choose a title' : 'Enter new title'}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        inputRef={descriptionBar} fullWidth
                        label="Description" placeholder="Choose a description"
                    />
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        component="label" variant="contained" tabIndex={0} startIcon={<CloudUpload />}
                        sx={{ mt: 1, borderRadius: 6 }}
                    >
                        Upload pics
                        <input type="file" multiple hidden onChange={e => handleFile(e)} />
                    </Button>
                </Grid>
                {fitData.pics.length > 0 && (
                    <>
                        <Typography sx={{ mt: 2, fontSize: '20px' }}>
                            Uploaded pics:
                        </Typography>
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
                                        color="error" variant="contained" sx={{ borderRadius: 3, mr: 0.5 }}
                                        onClick={() => removeFile(galleryIndex)}   
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                        <Stepper
                            length={fitData.pics ? fitData.pics.length : 0}
                            step={galleryIndex} setter={setGalleryIndex}
                            stickBottom={false}
                        />
                    </>
                )}
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                    <TextField
                        inputRef={searchBar} fullWidth
                        label="Item name" placeholder="Search for the item name"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end" onClick={e => searchItems(e)}>
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </Grid>
                {queryItems && queryItems.length > 0 &&
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{
                            bgcolor: 'custom.white', width: '350px', maxHeight: '250px',
                            overflow: 'auto', borderRadius: 6, border: '1px solid #000'
                        }}>
                            <ItemsTable
                                itemsData={convertItemsList(queryItems)} useType='fitForm-search'
                                itemClick={chooseItem} itemRemove={null}
                            />
                        </Paper>
                    </Grid>
                }
                {fitData.itemsID.length > 0 &&
                    <Grid size={{ xs: 12 }}>
                        <Typography sx={{ mt: 2, fontSize: '20px', alignSelf: 'flex-start' }}>
                            Fit items:
                        </Typography>
                        <Paper sx={{
                            bgcolor: 'custom.white', width: '350px', maxHeight: '250px',
                            overflow: 'auto', borderRadius: 6, border: '1px solid #000', mt: 2
                        }}>
                            <ItemsTable
                                itemsData={itemsCache} useType='fitForm-added'
                                itemClick={chooseItem} itemRemove={removeItem} 
                            />
                        </Paper>
                    </Grid>
                }
            </Grid>
            <Button
                type="submit" variant="contained"
                onClick={handleForm} sx={{ width: '70%', borderRadius: 3, mt: 3, mb: 2 }}
            >
                {capitalize(actionType)} fit
            </Button>
        </Box>
    );
};

export default FitForm;