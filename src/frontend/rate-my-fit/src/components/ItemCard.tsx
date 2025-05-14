import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Item } from '../types/item';

interface ItemCardProps {
    itemData: Item,
    itemClick: Function,
    itemRemove: Function | null
};

const ItemCard = ({ itemData, itemClick, itemRemove }: ItemCardProps) => (
    <ListItem
        sx={{ cursor: 'pointer' }} onClick={() => itemClick(itemData)}
        secondaryAction={
            itemRemove && (
                <IconButton edge="end" onClick={e => {
                    e.stopPropagation();
                    itemRemove(itemData);
                }}>
                    <Delete sx={{ color: 'error.main' }} />
                </IconButton>
            )
        }
    >
        <ListItemAvatar>
            <Avatar
                sx={{ width: '80px', height: '80px' }}
                alt={`${itemData.brand} ${itemData.name}`} src={itemData.img}
            />
        </ListItemAvatar>
        <ListItemText sx={{ ml: 4, color: 'custom.black' }}
            primary={
                <Typography sx={{ fontSize: '15px', fontWeight: 700 }}>
                    {itemData.brand}
                </Typography>
            }
            secondary={
                <>
                    <Typography sx={{ mt: 0, color: 'custom.gray', fontSize: '15px', fontWeight: 400 }}>
                        {itemData.name}
                    </Typography>
                    <Typography sx={{ mt: 1, color: 'custom.black', fontSize: '15px', fontWeight: 700 }}>
                        {itemData.price}$
                    </Typography>
                </>
            }
        />
    </ListItem>
);

export default ItemCard;