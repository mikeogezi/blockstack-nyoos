import React from 'react';
import './NewsList.css';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {
  Apps,
  Info,
  Money,
  OpenInNew,
  Share,
  PersonAdd,
  ExitToApp
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { 
  APP_NAME, 
  NEWS_API_KEY,
  CATEGORIES
} from '../constants/appInfo';
import { connect } from 'react-redux';
import BlockStackUtils from '../lib/BlockStackUtils';
import Header from './Header';
import { Redirect } from 'react-router-dom';

class NewsList extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoadingNews: false,
      errorLoadingNews: false,
      articles: [],
      linkToOpen: '',
      linkToShare: '',
      category: this.props.match.params.category
    };

    console.log('Category:', this.state.category);
  }

  componentDidUpdate (props, state) {
    const category = props.match.params.category;
    if (category !== state.category) {
      this.setState({ category: props.match.params.category });
      this._load();
    }
  }

  componentDidMount () {
    this._load();
  }

  _load = () =>
    this.state.category ? this._loadCategory(this.state.category) : this._loadNews();

  _loadCategory = async (category, country = 'us', pageSize = 10, page = 1) => {
    try {
      this.setState({ isLoadingNews: true });
      const url = 'https://newsapi.org/v2/top-headlines' + 
        `?category=${category}&country=${country}&apiKey=${NEWS_API_KEY}` +
        `&pageSize=${pageSize}&page=${page}`;
      console.log('URL', url);
      let res = await fetch(url);
      const { articles } = await res.json();
      this.setState({ articles });
    }
    catch (e) {
      this.setState({ errorLoadingNews: true });
      console.error(e);
    }
    finally {
      this.setState({ isLoadingNews: false });
    }
  }

  /**
   * category
   * The category you want to get headlines for. 
   * Possible options: 
   * business entertainment general health science sports technology. 
   * Note: you can't mix this param with the sources param.
   */
  _search = async (query, country = 'us', pageSize = 10, page = 1) => {
    try {
      this.setState({ isLoadingNews: true });
      const url = 'https://newsapi.org/v2/top-headlines' + 
        `?q=${query}&country=${country}&apiKey=${NEWS_API_KEY}` +
        `&pageSize=${pageSize}&page=${page}`;
      console.log('URL', url);
      let res = await fetch(url);
      const { articles } = await res.json();
      this.setState({ articles });
    }
    catch (e) {
      this.setState({ errorLoadingNews: true });
      console.error(e);
    }
    finally {
      this.setState({ isLoadingNews: false });
    }
  }

  _loadNews = async (country = 'us', pageSize = 10, page = 1) => {
    try {
      this.setState({ isLoadingNews: true });
      const url = 'https://newsapi.org/v2/top-headlines' + 
        `?country=${country}&apiKey=${NEWS_API_KEY}&pageSize=${pageSize}&page=${page}`;
      console.log('URL', url);
      let res = await fetch(url);
      const { articles } = await res.json();
      this.setState({ articles });
    }
    catch (e) {
      this.setState({ errorLoadingNews: true });
      console.error(e);
    }
    finally {
      this.setState({ isLoadingNews: false });
    }
  }

  _errorDialogCancel = () => {
    this.setState({ errorLoadingNews: false });
  }

  _errorDialogRetry = () => {
    this.setState({ errorLoadingNews: false });
    this._load();
  }

  _renderErrorDialog = (classes) => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.errorLoadingNews}
        onClose={this._errorDialogCancel}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">Loading Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A error occured while we were trying to load your {this.state.category || ''} articles. Please check your Internet connection then try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={this._errorDialogCancel} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" onClick={this._errorDialogRetry} color="primary" autoFocus>
            Try Again
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  _renderNewsFeed = (classes, articles) => {
    return (
      <List style={{ marginBottom: '16px', width: '85%' }}>
        {
          articles.map(({ author, title, description, url, urlToImage, publishedAt }) => (
            <ListItem key={url}>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={urlToImage}
                    title={description}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="large" fullWidth variant="contained" color="primary" onClick={e => this.setState({ linkToOpen: url })}>
                    <OpenInNew className={classes.iconInButton} />
                    Open Article
                  </Button>
                  <Button size="large" variant="outlined" color="primary" onClick={e => this.setState({ linkToShare: url })}>
                    <Share className={classes.iconInButton} />
                    Share
                  </Button>
                </CardActions>
              </Card>
            </ListItem>
          ))
        }
      </List>
    )
  }

  render () {
    const { classes } = this.props;
    const { isLoadingNews, articles, linkToOpen, linkToShare, category } = this.state;

    if (linkToOpen) {
      window.location = linkToOpen;
      return <Box />;
    }

    if (linkToShare) {
      return (
        <Redirect to={`/app/share/${linkToShare}/`} />
      )
    }

    return (
      <Box align="center" className={classes.container}>
        <Header>{(category && (category[0].toUpperCase() + category.slice(1))) || 'Nyoos Feed'}</Header>
        { isLoadingNews && <CircularProgress /> }
        { 
          articles.length ? this._renderNewsFeed(classes, articles) :
          !isLoadingNews ? <Typography variant="body1" align="center">No Articles Found.</Typography> :
          ''
        }
        { this._renderErrorDialog(classes) }
      </Box>
    );
  }
};

const styles = theme => ({
  container: {
    flexGrow: 1,
    flexWrap: 'wrap'
  },
  card: {
    width: '100%',
  },
  media: {
    height: '250px',
  },
  iconInButton: {
    marginRight: theme.spacing(1),
  },
});

export default withStyles(styles)(NewsList);