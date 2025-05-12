import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { Item } from '../types/item';
import ItemCard from './ItemCard';
import { getTotal } from '../utils';

interface ItemsTableProps {
    itemsData: {[itemID: string]: Item},
    useType: string,
    itemClick: Function,
    itemRemove: Function | null
};

const ItemsTable = ({ itemsData, useType, itemClick, itemRemove }: ItemsTableProps) => (
    <List sx={{ width: '100%', bgcolor: 'custom.white' }}>
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
                <ListItemText sx={{ color: 'custom.black', mb: -1 }}
                    primary={
                        <Typography sx={{ color: 'custom.gray', fontSize: '15px', fontWeight: 500, display: 'inline' }}>
                            Total:
                        </Typography>
                    }
                    secondary={
                        <Typography sx={{ ml: 0.5, color: 'custom.black', fontSize: '15px', fontWeight: 700, display: 'inline' }}>
                            {getTotal(Object.values(itemsData))}$
                        </Typography>
                    }
                />
            </ListItem>
        }
    </List>
);

export default ItemsTable;