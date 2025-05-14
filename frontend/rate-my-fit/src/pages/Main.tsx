import { useState, useEffect } from 'react';
import { SnackbarStatus } from '../types/UI'
import { Sort } from '../types/UI';
import { Fit } from '../types/fit';
import { Item } from '../types/item';
import { UserPreview } from '../types/user';
import { Container, Grid, Typography, Box, NativeSelect, IconButton, Stack, Pagination, Divider } from '@mui/material';
import { getTotalFits, getAllFits } from '../API/fit';
import { getItem } from '../API/item';
import { getUser, getUserPfpDirect } from '../API/user';
import Loader from '../components/UI/loader';
import FitCard from '../components/FitCard';
import { North, South } from '@mui/icons-material';
import { countPages } from '../utils';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';


const FITS_ON_PAGE = 15;
const SORTING_FIELD = {
    'Date': '_id', 'Popularity': 'totalReviews',
    'Grade': 'avgGrade', 'Price': 'totalPrice'
};
const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05, duration: 1, ease: 'easeOut'
        }
    })
};

const Main = () => {
    const [snackbarStatus, setSnackbarStatus] = useState<SnackbarStatus>({
        open: false, message: '', color: 'info'
    });
    
    const [pageNum, setPageNum] = useState<number>(1);
    const [sortType, setSortType] = useState<Sort>('Date');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DSC'>('DSC');
    const [totalFits, setTotalFits] = useState<number | null>(null);
    
    useEffect(() => {
        const fetchTotalFits = async () => {
            const totalFitsRequest = await getTotalFits();
            if (totalFitsRequest.status !== 200) {
                setSnackbarStatus({
                    open: true, message: totalFitsRequest.description, color: 'error'
                });
                throw new Error(totalFitsRequest.description);
            }
            setTotalFits(totalFitsRequest.data);
        };

        fetchTotalFits();
    }, []);

    const [fitsData, setFitsData] = useState<Fit[] | null>(null);
    const [itemsData, setItemsData] = useState<{
        [itemID: string]: Item
    } | null>(null);
    const [fitItems, setFitItems] = useState<{
        [fitID: string]: {
            [itemID: string]: Item
        }
    } | null>(null);
    const [authorsData, setAuthorsData] = useState<{
        [userID: string]: UserPreview
    } | null>(null);
    const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);

    useEffect(() => {
        setAllDataLoaded(false);
        setFitsData(null);
        setItemsData(null);
        setFitItems(null);
        setAuthorsData(null);

        const fetchFits = async () => {
            const fitsRequest = await getAllFits(
                (pageNum - 1) * FITS_ON_PAGE, FITS_ON_PAGE,
                SORTING_FIELD[sortType], sortDirection
            );
            if (fitsRequest.status !== 200) {
                setSnackbarStatus({
                    open: true, message: fitsRequest.description, color: 'error'
                });
                throw new Error(fitsRequest.description);
            }
            setFitsData(fitsRequest.data);

            let tempItemsData = {} as {
                [itemID: string]: Item
            };
            let tempFitItems = {} as {
                [fitID: string]: {
                    [itemID: string]: Item
                }
            };
            for (const fitData of fitsRequest.data) {
                tempFitItems[fitData.fitID] = {};
                for (const itemID of fitData.itemsID) {
                    if (!(itemID in tempItemsData)) {    
                        const itemRequest = await getItem(itemID);
                        if (itemRequest.status !== 200) {
                            throw new Error(itemRequest.description);
                        }
                        tempItemsData[itemID] = itemRequest.data;
                    }
                    tempFitItems[fitData.fitID][itemID] = tempItemsData[itemID];
                }
            }
            setItemsData(tempItemsData);
            setFitItems(tempFitItems);

            let tempAuthorsData = {} as { [userID: string]: UserPreview };
            for (const fitData of fitsRequest.data) {
                if (fitData.authorToken in tempAuthorsData) continue;
                tempAuthorsData[fitData.authorToken] = await fetchAuthor(fitData.authorToken);
            }
            setAuthorsData(tempAuthorsData);
        };

        const fetchAuthor = async (authorToken: string) => {
            const authorRequest = await getUser(authorToken, null);
            if (authorRequest.status !== 200) {
                setSnackbarStatus({
                    open: true, message: authorRequest.description, color: 'error'
                });
                throw new Error(authorRequest.description);
            }
            return {
                username: authorRequest.data.username,
                pfpLink: await getUserPfpDirect(authorToken)
            };
        };

        fetchFits();
    }, [pageNum, sortType, sortDirection]);

    useEffect(() => {
        setAllDataLoaded(
            [totalFits, fitsData, itemsData, authorsData].every(el => el !== null)
        );
    }, [totalFits, fitsData, itemsData, authorsData]);

    return (
        !allDataLoaded
        ?
            <Loader loaded={allDataLoaded} />
        :
            <Container maxWidth="md">
                <Stack sx={{ alignItems: 'center', textAlign: 'center' }}>
                    <Hero />
                </Stack>
                <Divider sx={{ borderBottomWidth: 3 }} />
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700, mr: 2 }}>
                        Sort by
                    </Typography>
                    <NativeSelect value={sortType} onChange={e => setSortType(e.target.value as Sort)}>
                        {(Object.keys(SORTING_FIELD) as Array<keyof typeof SORTING_FIELD>).map((field, index) =>
                            <option key={index} value={field}>
                                {field}
                            </option>
                        )}
                    </NativeSelect>
                    <IconButton onClick={() => setSortDirection(sortDirection === 'ASC' ? 'DSC' : 'ASC')}>
                        {sortDirection == 'ASC'
                        ?
                            <North />
                        :
                            <South />
                        }
                    </IconButton>
                </Box>
                <Grid container spacing={2} sx={{ mt: 3 }}>
                {fitsData && itemsData && fitItems && authorsData &&
                    fitsData.map((fit, index) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={fit.fitID}>
                        <motion.div
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        >
                        <FitCard
                            fitData={fit}
                            itemsData={fitItems[fit.fitID]}
                            authorData={authorsData[fit.authorToken]}
                        />
                        </motion.div>
                    </Grid>
                    ))
                }
                </Grid>
            {totalFits &&
                <Stack sx={{ mt: 4, alignItems: 'center' }}>
                    <Pagination
                        count={countPages(totalFits, FITS_ON_PAGE)} page={pageNum}
                        onChange={(_, value) => setPageNum(value)}
                    />
                </Stack>
            }
            </Container>
    );
};

export default Main;