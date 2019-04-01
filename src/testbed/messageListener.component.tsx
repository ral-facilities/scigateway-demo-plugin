import React from 'react';
import { withStyles, WithStyles, StyleRules } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import JSONPretty from 'react-json-pretty';

const styles = (): StyleRules => ({
  root: {
    width: '100%',
    paddingRight: 5,
  },
  card: {
    height: '100%',
  },
  content: {
    background: '#eee',
    margin: 20,
  },
});

interface MessageListenerComponentState {
  data: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  messages: any[];
}

class MessageListenerComponent extends React.Component<
  WithStyles<typeof styles>,
  MessageListenerComponentState,
  {}
> {
  public constructor(props: WithStyles<typeof styles>) {
    super(props);
    this.state = {
      messages: [],
      data: '{}',
    };

    document.addEventListener('daaas-frontend', event => {
      const updatedMessages = [...this.state.messages];
      updatedMessages.push((event as CustomEvent).detail);
      if (updatedMessages.length > 10) {
        updatedMessages.shift();
      }

      console.log(updatedMessages);

      this.setState({
        messages: updatedMessages,
        data: JSON.stringify(updatedMessages),
      });
    });
  }

  public render(): React.ReactElement {
    return (
      <div className={this.props.classes.root}>
        <Card className={this.props.classes.card}>
          <CardHeader title="Micro-frontend global message listener" />
          <CardContent className={this.props.classes.content}>
            <JSONPretty id="json-pretty" json={this.state.data} />
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(MessageListenerComponent);
