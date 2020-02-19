import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

function App() {
  const [originalDecklist, setOriginalDecklist] = useState('');
  const [favoredCards, setFavoredCards] = useState('');
  const [convertedDecklist, setConvertedDecklist] = useState('');
  const [expanded, setExpanded] = useState('original');

  useEffect(() => {
    const stored = localStorage.getItem('favoredCards');
    if (stored) {
      setFavoredCards(stored);
    }
  }, []);

  const handleChangeOriginalDecklist = (
    event: React.FormEvent<EventTarget>
  ) => {
    const target = event.target as HTMLInputElement;
    setOriginalDecklist(target.value);
  };

  const handleChangeConvertedDecklist = (
    event: React.FormEvent<EventTarget>
  ) => {
    const target = event.target as HTMLInputElement;
    setConvertedDecklist(target.value);
  };

  const handleChangeFavoredCards = (event: React.FormEvent<EventTarget>) => {
    const target = event.target as HTMLInputElement;
    setFavoredCards(target.value);
  };

  const handleChangePanel = (panel: string, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  };

  const handleClickConvert = () => {
    interface Card {
      cardName: string;
      setName: string;
      setNumber: string;
    }
    interface CardHash {
      [index: string]: Card;
    }
    const favoredHash = favoredCards
      .split(/[\n\r]/g)
      .reduce<CardHash>((result, line) => {
        const spaced = line.trim().split(' ');
        const setNumber = spaced[spaced.length - 1];
        const setName = spaced[spaced.length - 2];
        const cardName = spaced.slice(0, spaced.length - 2).join(' ');
        result[cardName] = {
          cardName,
          setName,
          setNumber
        };
        return result;
      }, {});
    const converted = originalDecklist
      .split(/[\n\r]/g)
      .map(line => {
        if (line.length > 0 && parseInt(line[0], 10)) {
          const spaced = line.trim().split(' ');
          const cardCount = spaced[0];
          const cardName = spaced.slice(1, spaced.length - 2).join(' ');
          if (favoredHash[cardName]) {
            return `${cardCount} ${cardName} ${favoredHash[cardName].setName} ${favoredHash[cardName].setNumber}`;
          } else {
            return line;
          }
        } else {
          return line;
        }
      })
      .join('\n');
    setConvertedDecklist(converted);
    setExpanded('converted');
    localStorage.setItem('favoredCards', favoredCards);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ExpansionPanel
            expanded={expanded === 'original'}
            onChange={(event, isExpanded) =>
              handleChangePanel('original', isExpanded)
            }
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Original</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                fullWidth
                multiline
                rowsMax="80"
                value={originalDecklist}
                onChange={handleChangeOriginalDecklist}
                variant="outlined"
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === 'converted'}
            onChange={(event, isExpanded) =>
              handleChangePanel('converted', isExpanded)
            }
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Converted</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                fullWidth
                multiline
                rowsMax="80"
                value={convertedDecklist}
                onChange={handleChangeConvertedDecklist}
                variant="outlined"
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Favored Cards"
                multiline
                rowsMax="80"
                value={favoredCards}
                onChange={handleChangeFavoredCards}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleClickConvert}
              >
                Convert
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
