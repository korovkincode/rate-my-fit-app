import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { Item } from '../types/item';
import ItemCard from './ItemCard';
import { getTotal } from '../utils';

const ItemsTable = ({ itemsData, useType, itemClick, itemRemove }: {
    itemsData: {[itemID: string]: Item}, useType: string, itemClick: Function, itemRemove: Function | null
}) => (
    <List sx={{ width: '100%', bgcolor: '#FFFFFF' }}>
        {Object.values(itemsData).map((item, index) =>
            <>
                <ItemCard key={index} itemData={item} itemClick={itemClick} itemRemove={itemRemove} />
                {useType == 'fitCard' || index < Object.values(itemsData).length - 1 &&
                    <Divider
                        sx={{ bgcolor: 'secondary.light', borderBottomWidth: 2 }}
                        variant="middle" component="li"
                    />
                }
            </>
        )}
        {useType === 'fitCard' &&
            <ListItem>
                <ListItemText sx={{ color: '#000000' }}
                    primary={
                        <Typography sx={{ color: '#7A7A7A', fontSize: '15px', fontWeight: 500, display: 'inline' }}>
                            Total:
                        </Typography>
                    }
                    secondary={
                        <Typography sx={{ ml: 0.5, color: '#000000', fontSize: '15px', fontWeight: 700, display: 'inline' }}>
                            {getTotal(Object.values(itemsData))}$
                        </Typography>
                    }
                />
            </ListItem>
        }
    </List>
);

export default ItemsTable;