import { useState, useRef } from 'react';
import { Fit } from '../types/fit';
import { Item } from '../types/item';
import { Card, CardHeader, Avatar, CardMedia, MobileStepper, Button, IconButton, Drawer, CardActions } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import { API_URL } from '../API/API';
import { formatDate } from '../utils';
import { Link as LinkDOM } from 'react-router-dom';
import ItemsTable from './ItemsTable';
import { BounceDown, Shake } from './animations';

const FitCard = ({ fitData, itemsData, usernamesData, authorPfpLink }: {
    fitData: Fit, itemsData: {[itemID: string]: Item},
    usernamesData: {[userID: string]: string}, authorPfpLink: string
}) => {
    
    if (!fitData.authorToken) {
        throw new Error('Author token is not defined');
    }

    const [imgIndex, setImgIndex] = useState<number>(0);

    const [itemsOpen, setItemsOpen] = useState<boolean>(false);
    const fitContainerRef = useRef(null);

    return (
        <>
            <Card sx={{ borderRadius: 5, boxShadow: 3, position: 'relative', bgcolor: '#000000' }} ref={fitContainerRef}>
                <CardActions
                    sx={{
                        justifyContent: 'center',
                        height: '15px',
                        bgcolor: '#FFFFFF',
                        width: '40%',
                        ml: 'auto',
                        mr: 'auto',
                        borderBottomLeftRadius: 15,
                        borderBottomRightRadius: 15
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
                        title={fitData.title}
                        subheader={formatDate(fitData.date)}
                    />
                    <CardMedia        
                        component="img"
                        image={fitData.picnames ? `${API_URL}/static/${fitData.picnames[imgIndex]}` : ''}
                        alt={`${fitData.title} - ${imgIndex + 1}`}
                    />
                </LinkDOM>
                <Drawer
                    open={itemsOpen}
                    onClose={() => setItemsOpen(false)}
                    anchor="top"
                    variant="temporary"
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
                    <ItemsTable itemsData={itemsData} />
                </Drawer>
            </Card>
            <MobileStepper
                variant="dots" steps={fitData.picnames?.length || 0} position="static"
                activeStep={imgIndex} sx={{ flexGrow: 1 }}
                nextButton={
                    <Button 
                        size="small" onClick={() => setImgIndex(imgIndex + 1)}
                        disabled={imgIndex === ((fitData.picnames?.length ?? 0) - 1)}
                    >
                        <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                <Button
                    size="small" onClick={() => setImgIndex(imgIndex - 1)}
                    disabled={imgIndex === 0}
                >
                    <KeyboardArrowLeft />
                </Button>
                }
            />
        </>
    );
};

export default FitCard;