import React from 'react';
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
  PersonAdd,
  ExitToApp
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { 
  APP_NAME, 
  NEWS_API_KEY 
} from '../constants/appInfo';
import { connect } from 'react-redux';
import BlockStackUtils from '../lib/BlockStackUtils';
import Header from './Header';
import { Redirect } from 'react-router-dom';

class Share extends React.Component {
  render () {
    const { classes } = this.props;
    const { linkToShare } = this.props.match.params;

    return (
      <Box className={classes.container}>
        <Header>Sharing</Header>
        <Link to={linkToShare}>{linkToShare}</Link>
      </Box>
    );
  }
};

const styles = theme => ({
  container: {
    flexGrow: 1,
    flexWrap: 'wrap'
  }
});

export default withStyles(styles)(Share);