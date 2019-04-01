import React from 'react';
import { withStyles, WithStyles, StyleRules } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import MessageListenerComponent from './messageListener.component';
import MessageSenderComponent from './messageSender.component';

const styles = (): StyleRules => ({
  root: {
    display: 'flex',
    background: '#aaa',
    padding: 20,
    flexDirection: 'column' as 'column',
    minHeight: '100vh',
  },
  card: {
    width: '100%',
  },
  content: {
    margin: 5,
    border: '1px dashed black',
  },
  tools: {
    display: 'flex',
    marginTop: 10,
  },
});

interface TestBedComponentProps {
  pluginName: string;
  children?: React.ReactElement;
}

type CombinedTestBedProps = TestBedComponentProps & WithStyles<typeof styles>;

const TestBedComponent = (props: CombinedTestBedProps): React.ReactElement => (
  <div className={props.classes.root}>
    <Card className={props.classes.card}>
      <CardHeader
        title={props.pluginName}
        subheader="Mounted in plugin testbed"
      />
      <CardContent className={props.classes.content}>
        {props.children}
      </CardContent>
    </Card>
    <div className={props.classes.tools}>
      <MessageListenerComponent />
      <MessageSenderComponent />
    </div>
  </div>
);

export default withStyles(styles)(TestBedComponent);
