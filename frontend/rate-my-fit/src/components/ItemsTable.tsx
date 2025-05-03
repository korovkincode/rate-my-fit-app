import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider } from '@mui/material';
import { Item } from '../types/item';
import { getTotal } from '../utils';

const ItemsTable = ({ itemsData }: {itemsData: {[itemID: string]: Item}}) => {
    return (
        <List sx={{ width: '100%', bgcolor: '#FFFFFF' }}>
            {Object.values(itemsData).map((item, index) =>
                <>
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar
                                sx={{ width: '80px', height: '80px' }}
                                alt={`${item.brand} ${item.name}`} src={item.img}
                            />
                        </ListItemAvatar>
                        <ListItemText sx={{ ml: 4, color: '#000000' }}
                            primary={
                                <Typography sx={{ fontSize: '15px', fontWeight: 700 }}>
                                    {item.brand}
                                </Typography>
                            }
                            secondary={
                                <>
                                    <Typography sx={{ mt: 0, color: '#7A7A7A', fontSize: '15px', fontWeight: 400 }}>
                                        {item.name}
                                    </Typography>
                                    <Typography sx={{ mt: 1, color: '#000000', fontSize: '15px', fontWeight: 700 }}>
                                        {item.price}$
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                    <Divider
                        sx={{ bgcolor: 'secondary.light', borderBottomWidth: 2 }}
                        variant="middle" component="li"
                    />
                </>
            )}
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
        </List> 
    );
};

export default ItemsTable;