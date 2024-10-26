import React from 'react';
import { Card, CardContent, Typography, Grid, Tooltip } from '@mui/material';
import { PriorityHigh, LowPriority, Warning, Error, Event } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
    overflow: 'hidden',
  }
});

const priorityIcons = {
  '1': <LowPriority color="success" />,
  '2': <PriorityHigh color="warning" />,
  '3': <Warning sx={{ color: 'orange' }} />,
  '4': <Error color="error" />,
};

function TaskItem({ task, onEdit }) {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={6} md={4} onClick={() => onEdit(task)}>
      <Tooltip title="Cliquez pour éditer">
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h5" component="div" noWrap>
              {task.title}
            </Typography>
            {task.description && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {task.description}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" style={{ display: 'flex', alignItems: 'center' }}>
              {priorityIcons[task.priority]}{" "}
              Priorité: {task.priority}
            </Typography>
            {task.deadline && (
              <Typography variant="body2" color="text.secondary" style={{ display: 'flex', alignItems: 'center' }}>
                <Event />{" "}
                Date Limite: {task.deadline}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Tooltip>
    </Grid>
  );
}

export default TaskItem;


