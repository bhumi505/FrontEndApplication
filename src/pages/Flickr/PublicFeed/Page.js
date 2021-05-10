import React, { useEffect } from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import SearchIcon from '@material-ui/icons/Search';
import useStates from "../../../states";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  grid: {
    marginTop: "15px",
    marginBottom: "15px"
  },
  body1: {
    fontSize: "12px"
  },
  searchButton: {
    margin: theme.spacing(1),
    marginRight: 0,
    float: "right",
    width: "144px"
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  caption: {
    textTransform: "uppercase",
    fontSize: "10px"
  },
}));

export const PageComponent = () => {
  const [openSearch, setOpenSearch] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const classes = useStyles();
  const [state, actions] = useStates();

  const handleClickOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleCloseSearch = () => {
    setOpenSearch(false);
  };

  const handleClickOpenInfo = (item) => {
    setOpenInfo(true);

    actions.setStateObject({
      infoTitle: item.title,
      infoLink: item.link.replace("https:", ""),
      infoDescription: item.description,
      infoAuthor: replaceAuthor(item.author),
      infoAuthorID: item.author_id,
      infoDateTaken: moment(item.date_taken).format("LLL"),
      infoPublished: moment(item.published).format("LLL"),
    });
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };

  const handleChange = name => event => {
    actions.handleInputChange(name, event);
  };

  const onClickSearch = () => {
    let params = {};
    let textSearchIds = state.searchIds;
    let textSearchTags = state.searchTags;
    let newTextSearchIds = textSearchIds.replace(/\n/g, ",");
    let newTextSearchTags = textSearchTags.replace(/\n/g, ",");

    if (newTextSearchIds !== "") {
      params.ids = newTextSearchIds;
    }

    if (newTextSearchTags !== "") {
      params.tags = newTextSearchTags;
    }

    getData(params);

    setOpenSearch(false);
  };

  const replaceAuthor = (text) => {
    let newText = text.replace(`nobody@flickr.com ("`, "");
    return newText.replace(`")`, "");
  };

  const getData = (params = null) => {
    actions.get('flickr/publicFeed', false, false, params).then((response) => {
      actions.setStateObject({
        title: response.data.title,
        modified: moment(response.data.modified).format("LLLL"),
        items: response.data.items
      });
    }).catch((error) => {
      console.error(error);
    });
  };

  useEffect(() => {
    setOpenSearch(false);
    setOpenInfo(false);

    actions.setStateObject({
      title: null,
      modified: null,
      items: null,
      searchIds: "",
      searchTags: "",
      infoTitle: "",
      infoLink: "",
      infoDescription: "",
      infoAuthor: "",
      infoAuthorID: "",
      infoDateTaken: "",
      infoPublished: "",
    });

    getData();
  }, []);

  return (
    <React.Fragment>
      <Container fixed>
        <Grid container spacing={4} className={classes.grid}>
          <Grid item xs={6}>
            <Typography variant="h5">
              {state.title && state.title}
            </Typography>
            <Typography variant="body1" className={classes.body1}>
              {state.modified && "last update on " + state.modified}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.searchButton}
              startIcon={<SearchIcon />}
              onClick={handleClickOpenSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        <GridList cols={4} spacing={4}>
          {state.items && state.items.length > 0 && state.items.map((item, key) => (
            <GridListTile key={item.link}>
              <img src={item.media.m} alt={item.title} />
              <GridListTileBar
                title={item.title}
                subtitle={<span style={{ lineHeight: "normal" }}>by: {replaceAuthor(item.author)}</span>}
                actionIcon={
                  <IconButton 
                    aria-label={`info about ${item.title}`} 
                    className={classes.icon} 
                    title="Click for more info"
                    onClick={e => handleClickOpenInfo(item)}
                  >
                    <InfoIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </Container>
      <Dialog open={openSearch} maxWidth="sm" onClose={handleCloseSearch} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Search Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To search any images using <strong>author id</strong> or <strong>tags</strong>. 
            Separate with new line if using multiple <strong>author id</strong> or <strong>tags</strong>.
          </DialogContentText>
          <TextField
            margin="dense"
            id="ids"
            label="Author ID..."
            fullWidth
            variant="outlined"
            multiline
            rowsMax={3}
            value={state.searchIds}
            onChange={handleChange('searchIds')}
          />
          <TextField
            margin="dense"
            id="tags"
            label="Tags..."
            fullWidth
            variant="outlined"
            multiline
            rowsMax={3}
            value={state.searchTags}
            onChange={handleChange('searchTags')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSearch} color="primary">
            Close
          </Button>
          <Button onClick={onClickSearch} color="primary">
            Search
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openInfo} maxWidth="sm" fullWidth onClose={handleCloseInfo} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Info</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="caption" display="block" className={classes.caption}>
                Title
              </Typography>
              <Typography variant="subtitle1">
                {state.infoTitle ? state.infoTitle : "-"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" display="block" className={classes.caption}>
                Author
              </Typography>
              <Typography variant="subtitle1">
                {state.infoAuthor ? state.infoAuthor : "-"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" display="block" className={classes.caption}>
                Author ID
              </Typography>
              <Typography variant="subtitle1">
                {state.infoAuthorID ? state.infoAuthorID : "-"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" display="block" className={classes.caption}>
                Date Taken
              </Typography>
              <Typography variant="subtitle1">
                {state.infoDateTaken ? state.infoDateTaken : "-"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" display="block" className={classes.caption}>
                Published
              </Typography>
              <Typography variant="subtitle1">
                {state.infoPublished ? state.infoPublished : "-"}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Link to={state.infoLink ? state.infoLink : "#"} underline="none" target="_blank" rel="noopener noreferrer">
            <Button color="primary">
              Open Image Location
            </Button>
          </Link>
          <Button onClick={handleCloseInfo} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default PageComponent;
