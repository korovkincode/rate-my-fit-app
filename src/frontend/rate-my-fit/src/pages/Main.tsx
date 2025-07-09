import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
  Container,
  Grid,
  Typography,
  Box,
  NativeSelect,
  IconButton,
  Stack,
  Pagination,
  Divider
} from '@mui/material';
import { North, South } from '@mui/icons-material';

import { SnackbarStatus } from '../types/UI';
import { Sort } from '../types/UI';
import { Fit } from '../types/fit';

import { countPages, convertPfpList } from '../utils';

import { getTotalFits, getAllFits } from '../API/fit';

import Loader from '../components/UI/loader';
import FitCard from '../components/FitCard';
import Hero from '../components/Hero';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [_, setSnackbarStatus] = useState<SnackbarStatus>({
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
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    setAllDataLoaded(false);
    setFitsData(null);

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

      fitsRequest.data = convertPfpList(fitsRequest.data);
      setFitsData(fitsRequest.data);
    };

    fetchFits();
  }, [pageNum, sortType, sortDirection]);

  useEffect(() => {
    setAllDataLoaded(
      [totalFits, fitsData].every(el => el !== null)
    );
  }, [totalFits, fitsData]);

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
          {fitsData &&
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
                    itemsData={fit.items}
                    authorData={fit.author}
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