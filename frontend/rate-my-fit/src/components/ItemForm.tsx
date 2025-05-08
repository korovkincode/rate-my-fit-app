import { Dispatch, FormEvent, SetStateAction, useEffect, useState, useRef } from 'react';
import { SnackbarStatus } from '../types/UI';
import { Form, FormType } from '../types/item';
import { Box, IconButton, Avatar, Typography, Grid, TextField, Button, Autocomplete, InputAdornment } from '@mui/material';
import { Close, Checkroom, Visibility, VisibilityOff } from '@mui/icons-material';
import { capitalize } from '../utils';
import { addItem, getAllBrands } from '../API/item';

const ItemForm = ({ actionType, openSetter, snackbarSetter }: {
    actionType: FormType, openSetter: Dispatch<SetStateAction<boolean>>, snackbarSetter: Dispatch<SetStateAction<SnackbarStatus>>
}) => {

    const [itemData, setItemData] = useState<Form>({
        brand: '', name: '', img: '', price: 0, category: null
    });
    const [brandsList, setBrandsList] = useState<string[]| null>(null);
    const brandInput = useRef<HTMLInputElement>(null)
    const [showPreview, setShowPreview] = useState<boolean>(false);

    useEffect(() => {
        const fetchBrands = async () => {
            const brandsRequest = await getAllBrands();
    
            if (brandsRequest.status !== 200) {
                snackbarSetter({
                    open: true, message: brandsRequest.description, color: 'error'
                });
                return;
            }
            setBrandsList(brandsRequest.data);
        };

        fetchBrands();
    }, []);

    const handleForm = async (event: FormEvent) => {
        event.preventDefault();
        for (const key of ['brand', 'name', 'img'] as Array<keyof Form>) {
            if (itemData[key] === '') {
                snackbarSetter({
                    open: true, message: 'Fill in all fields', color: 'error'
                });
                return;
            }
        }

        let formResponse;
        if (actionType === 'add') {
            formResponse = await addItem(itemData);
        } else if (actionType === 'update') {

        }

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
                <Checkroom />
            </Avatar>
            <Typography sx={{ mt: 2, fontWeight: 700 }} component="h1" variant="h5">
                {capitalize(actionType)} item
            </Typography>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Grid size={{ xs: 12 }}>
                    <Autocomplete
                        ref={brandInput} freeSolo disablePortal
                        options={brandsList || []} onChange={(_, value) => setItemData({...itemData, brand: value || ''})}
                        renderInput={(params) =>
                            <TextField
                                required {...params} label="Brand"
                                onChange={e => setItemData({...itemData, brand: (e.target as HTMLInputElement).value || ''})}
                            />
                        }
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required value={itemData.name} onChange={e => setItemData({...itemData, name: e.target.value})}
                        fullWidth label="Name" placeholder="Enter item name"
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required value={itemData.img} onChange={e => setItemData({...itemData, img: e.target.value})}
                        onPaste={e => setItemData({...itemData, img: (e.target as HTMLInputElement).value})}
                        fullWidth label="Image Link" placeholder="Enter item image link"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end" onClick={() => setShowPreview(!showPreview)}>
                                            {showPreview ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    {showPreview &&
                        <Avatar
                            sx={{ width: '160px', height: '160px', ml: 'auto', mr: 'auto', mt: 2 }}
                            alt={`${itemData.brand} ${itemData.name}`} src={itemData.img}
                        />
                    }
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required value={itemData.price} onChange={e => setItemData({...itemData, price: parseInt(e.target.value) || 0})}
                        type="number" fullWidth label="Price" placeholder="Enter item price"
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        value={itemData.category} onChange={e => setItemData({...itemData, category: e.target.value})}
                        fullWidth label="Category" placeholder="Enter item category"
                    />
                </Grid>
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

export default ItemForm;