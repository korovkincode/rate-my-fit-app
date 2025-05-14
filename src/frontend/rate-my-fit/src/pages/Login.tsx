import { Box, Avatar, Typography, Container, Link as LinkMUI} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as LinkDOM } from 'react-router-dom';
import UserForm from '../components/UserForm';

const Signup = () => {
    return (
        <Container maxWidth="xs">
			<Box sx={{
				marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'
			}}>
				<Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
					Login
				</Typography>
				<UserForm actionType="login" />
				<LinkDOM to="/signup">
                    <LinkMUI variant="body2">Don't have an account yet? Signup</LinkMUI>
                </LinkDOM>
			</Box>
	    </Container>
    );
};

export default Signup;