import { FormControlLabel, FormLabel, Grid, makeStyles, Paper, RadioGroup } from "@material-ui/core";

const options = ["product","store","category","keyword","below price","above price"];
export const [PRODUCTS,STORE,CATEGORY,KEYWORD,BELOW_PRICE,ABOVE_PRICE] = options;

const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  }));
  

const SearchOptions = () => {

    return(
        <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                    <Paper className={classes.control}>
                        <Grid container>
                            <Grid item>
                                <FormLabel>spacing</FormLabel>
                                <RadioGroup
                                    name="search-by"
                                    aria-label="Search by..."
                                    value={value.toString()}
                                    onChange={handleChange}
                                    row
                                    >
                                        {options.map((value) => (
                                            <FormControlLabel
                                                key={value}
                                                value={value.toString()}
                                                control={<Radio />}
                                                label={value.toString()}
                                                />
                                        ))}
                            </RadioGroup>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );

}


export default SearchOptions;