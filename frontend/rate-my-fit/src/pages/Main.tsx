import { useState, useEffect } from 'react';
import { SnackbarStatus } from '../types/UI';
import { Fit } from '../types/fit';
import { Item } from '../types/item';
import { UserPreview } from '../types/user';
import { Container } from '@mui/material';
import { getAllFits } from '../API/fit';
import { getItem } from '../API/item';
import { getUser, getUserPfpDirect } from '../API/user';

const FITS_ON_PAGE = 15;
const SORTING_FIELD = {
    'Date': '_id', 'Popularity': 'totalReviews',
    'Grade': 'avgGrade', 'Price': 'totalPrice'
};

const Main = () => {
    const [snackbarStatus, setSnackbarStatus] = useState<SnackbarStatus>({
        open: false, message: '', color: 'info'
    });

    const [pageNum, setPageNum] = useState<number>(1);
    const [sortType, setSortType] = useState<'Date' | 'Popularity' | 'Grade' | 'Price'>('Date');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DSC'>('DSC');
    const [fitsData, setFitsData] = useState<Fit[] | null>(null);
    const [itemsData, setItemsData] = useState<{
        [itemID: string]: Item
    }| null>(null);
    const [authorsData, setAuthorsData] = useState<{
        [userID: string]: UserPreview
    } | null>(null);
    const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);

    useEffect(() => {
        setAllDataLoaded(false);
        const fetchFits = async () => {
            const fitsRequest = await getAllFits(
                (pageNum - 1) * FITS_ON_PAGE, FITS_ON_PAGE,
                SORTING_FIELD[sortType], sortDirection
            );
            if (fitsRequest.status !== 200) {
                setSnackbarStatus({
                    open: true, message: fitsRequest.description, color: 'error'
                });
                return;
            }
            setFitsData(fitsRequest.data);

            let tempItemsData = {} as { [itemID: string]: Item };
            for (const fitData of fitsRequest.data) {
                for (const itemID of fitData.itemsID) {
                    if (itemID in tempItemsData) continue;

                    const itemRequest = await getItem(itemID);
                    if (itemRequest.status !== 200) {
                        throw new Error(itemRequest.description);
                    }
                    tempItemsData[itemID] = itemRequest.data;
                }
            }
            setItemsData(tempItemsData);

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
    }, [pageNum, sortType]);

    useEffect(() => {
        setAllDataLoaded(
            [fitsData, itemsData, authorsData].every(el => el !== null)
        );
    }, [fitsData, itemsData, authorsData]);

    return (
        <Container maxWidth="md">
            
        </Container>
    );
};

export default Main;