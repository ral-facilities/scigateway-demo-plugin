import React from 'react';
import { withStyles, WithStyles, StyleRules } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

const styles = (): StyleRules => ({
  root: {
    width: '100%',
    paddingLeft: 5,
  },
  card: {
    height: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'flex-end',
  },
  select: {
    width: '100%',
    marginBottom: 10,
  },
});

interface MessageSenderComponentState {
  typeOfMessage: string;
}

const exampleMessages = {
  REGISTER_ROUTE: {
    section: 'Data',
    link: '/plugin1',
    plugin: 'demo_plugin',
  },
  TEST: {},
};

class MessageSenderComponent extends React.Component<
  WithStyles<typeof styles>,
  MessageSenderComponentState,
  {}
> {
  public constructor(props: WithStyles<typeof styles>) {
    super(props);
    this.state = {
      typeOfMessage: Object.keys(exampleMessages)[0],
    };
  }

  private handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    this.setState({ typeOfMessage: event.target.value });
  };

  private fireMessage = (): void => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const payload = (exampleMessages as any)[this.state.typeOfMessage];
    const message = {
      type: this.state.typeOfMessage,
      payload,
    };
    document.dispatchEvent(new CustomEvent('scigateway', { detail: message }));
  };

  public render(): React.ReactElement {
    return (
      <div className={this.props.classes.root}>
        <Card className={this.props.classes.card}>
          <CardHeader title="Micro-frontend global message sender" />
          <CardContent className={this.props.classes.content}>
            <Select
              className={this.props.classes.select}
              value={this.state.typeOfMessage}
              onChange={this.handleChange}
              inputProps={{
                name: 'age',
                id: 'age-simple',
              }}
            >
              {Object.keys(exampleMessages).map(k => (
                <MenuItem key={k} value={k}>
                  {k}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={this.fireMessage}
            >
              Fire event
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(MessageSenderComponent);
