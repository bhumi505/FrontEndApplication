import moment from 'moment';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		marginTop: "calc(5% + 5px)",
 		bottom: 0
	},
	appbar: {
		alignItems: 'center',
	},
	typography: {
		flexGrow: 1,
		textAlign: "center"
	}
}));

export default function Footer() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<AppBar position="static" className={classes.appbar}>
				<Container maxWidth="md">
					<Toolbar>
						<Typography variant="body1" color="inherit" className={classes.typography}>
							© {moment().format("YYYY")} Developer
					</Typography>
					</Toolbar>
				</Container>
			</AppBar>
		</div>
	)
}