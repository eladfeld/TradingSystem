import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import { Paper } from '@material-ui/core';

const paperStyle={padding :20,height:"auto",width:"700px", margin:"20px auto"}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

export default function Inbox({getAppState}) {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const {username, userId, chats} = getAppState();


  const getChatMembersNames = (chat) =>{
    return "Alice, Bob, Charlie";
  }

  const getLastMessagePreview = (chat) =>{
    return "Got it. See you tomorrow!";
  }

  const renderChatPreview = (chat) =>{
    return(
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={getChatMembersNames(chat)}
            secondary={secondary ? `${getLastMessagePreview(chat)}` : null}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
      </ListItem>
    );
  }

  return (
    <Paper style={paperStyle}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" className={classes.title}>
            {`Messages`}
          </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
              {generate(renderChatPreview(null))}
            </List>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}