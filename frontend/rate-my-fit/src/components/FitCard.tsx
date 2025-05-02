import { useState } from 'react';
import { Fit } from '../types/fit';
import { Item } from '../types/item';
import { Card, CardHeader, Avatar, CardMedia, MobileStepper, Button, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, Visibility } from '@mui/icons-material';
import { API_URL } from '../API/API';
import { formatDate } from '../utils';
import { Link as LinkDOM } from 'react-router-dom';


const FitCard = ({ fitData, itemsData, usernamesData, authorPfpLink }: {
    fitData: Fit, itemsData: {[itemID: string]: Item},
    usernamesData: {[userID: string]: string}, authorPfpLink: string
}) => {
    
    if (!fitData.authorToken) {
        throw new Error('Author token is not defined');
    }

    const [imgIndex, setImgIndex] = useState(0);

    return (
        <>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardHeader
                    avatar={
                        <LinkDOM to={`/user/@${usernamesData[fitData.authorToken]}`}>
                            <Avatar src={authorPfpLink} />
                        </LinkDOM>
                    }
                    action={
                        <IconButton sx={{ mr: 0.3, mt: 0.3 }}>
                            <LinkDOM
                                to={`/fit/${fitData.fitID}`}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                            >
                                <Visibility />
                            </LinkDOM>
                        </IconButton>
                    }
                    slotProps={{
                        title: {fontSize: 24},
                        subheader: {fontSize: 14}
                    }}
                    title={fitData.title}
                    subheader={formatDate(fitData.date)}
                />
                <CardMedia        
                    component="img"
                    image={fitData.picnames ? `${API_URL}/static/${fitData.picnames[imgIndex]}` : ''}
                    alt={`${fitData.title} - ${imgIndex + 1}`}
                />
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