import { Box, Avatar, Typography, Container, Link as LinkMUI} from '@mui/material';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import { Link as LinkDOM } from 'react-router-dom';
import UserForm from '../components/UserForm';

const Signup = () => {
    return (
        <Container maxWidth="xs">
			<Box sx={{
				marginTop: 8,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center' }}
            >
				
				<Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
					<AccountCircleOutlined />
				</Avatar>
				<Typography component="h1" variant="h5">
					Signup
				</Typography>
				<UserForm actionType="signup" />
				<LinkDOM to="/login">
                    <LinkMUI variant="body2">Already have an account? Login</LinkMUI>
                </LinkDOM>
			</Box>
	    </Container>
    );
};

export default Signup;