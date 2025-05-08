import { useState, useRef } from 'react';
import { Fit } from '../types/fit';
import { Item } from '../types/item';
import { Card, CardHeader, Avatar, CardMedia, IconButton, Drawer, CardActions } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { API_URL } from '../API/API';
import { formatDate } from '../utils';
import { Link as LinkDOM, useNavigate } from 'react-router-dom';
import ItemsTable from './ItemsTable';
import { BounceDown, Shake } from './UI/animations';
import Stepper from './UI/stepper';

interface FitCardProps {
    fitData: Fit,
    itemsData: {[itemID: string]: Item},
    usernamesData: {[userID: string]: string},
    authorPfpLink: string
};

const FitCard = ({ fitData, itemsData, usernamesData, authorPfpLink }: FitCardProps) => {
    if (!fitData.authorToken) {
        throw new Error('Author token is not defined');
    }

    const [galleryIndex, setGalleryIndex] = useState<number>(0);

    const [itemsOpen, setItemsOpen] = useState<boolean>(false);
    const fitContainerRef = useRef(null);

    const navigate = useNavigate();
    const itemRedirect = (itemData: Item) => navigate(`/item/${itemData.itemID}`);
    return (
        <>
            <Card sx={{ borderRadius: 5, boxShadow: 3, position: 'relative' }} ref={fitContainerRef}>
                <CardActions
                    sx={{
                        justifyContent: 'center', height: '15px',
                        bgcolor: '#FFFFFF', width: '40%',
                        ml: 'auto', mr: 'auto',
                        borderBottomLeftRadius: 15, borderBottomRightRadius: 15
                    }}
                >
                    <IconButton onClick={() => setItemsOpen(true)} sx={{ color: '#000000' }}>
                        <KeyboardArrowDown sx={{ animation: `${BounceDown(3)} 2s ease infinite` }} />
                    </IconButton>
                </CardActions>
                <LinkDOM to={`/fit/${fitData.fitID}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <CardHeader
                        avatar={
                            <LinkDOM to={`/user/@${usernamesData[fitData.authorToken]}`}>
                                <Avatar
                                    alt={usernamesData[fitData.authorToken]}
                                    src={authorPfpLink}
                                    sx={{
                                        mr: 0.5,
                                        animation: `${Shake(1.1, 3)} 2s ease infinite`
                                    }} 
                                />
                            </LinkDOM>
                        }
                        slotProps={{
                            title: {fontSize: 24, fontWeight: 700},
                            subheader: {fontSize: 14, fontWeight: 300}
                        }}
                        title={fitData.title} subheader={formatDate(fitData.date)}
                    />
                    <CardMedia        
                        component="img"
                        image={fitData.picnames ? `${API_URL}/static/${fitData.picnames[galleryIndex]}` : ''}
                        alt={`${fitData.title} - ${galleryIndex + 1}`}
                    />
                </LinkDOM>
                <Drawer
                    open={itemsOpen} onClose={() => setItemsOpen(false)}
                    anchor="top" variant="temporary"
                    transitionDuration={{ appear: 100, enter: 500, exit: 500 }}
                    container={fitContainerRef.current}
                    ModalProps={{
                        container: fitContainerRef.current,
                        disablePortal: true
                    }}
                    sx={{
                        position: 'absolute', 
                        '& .MuiPaper-root': {
                            position: 'absolute'
                        }
                    }}
                >
                    <ItemsTable itemsData={itemsData} useType='fitCard' itemClick={itemRedirect} itemRemove={null} />
                </Drawer>
            </Card>
            <Stepper length={fitData.picnames ? fitData.picnames.length : 0} step={galleryIndex} setter={setGalleryIndex} />
        </>
    );
};

export default FitCard;