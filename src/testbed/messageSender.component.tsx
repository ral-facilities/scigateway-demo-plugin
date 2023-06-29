import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Select,
  MenuItem,
  Button,
  Box,
  SelectChangeEvent,
} from '@mui/material';

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

export default class MessageSenderComponent extends React.Component<
  Record<string, never>,
  MessageSenderComponentState
> {
  public constructor() {
    super({});
    this.state = {
      typeOfMessage: Object.keys(exampleMessages)[0],
    };
  }

  private handleChange = (event: SelectChangeEvent): void => {
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
      <Box sx={{ width: '100%', paddingLeft: 5 }}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Micro-frontend global message sender" />
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Select
              sx={{ width: '100%', marginBottom: 10 }}
              value={this.state.typeOfMessage}
              onChange={this.handleChange}
              inputProps={{
                name: 'age',
                id: 'age-simple',
              }}
            >
              {Object.keys(exampleMessages).map((k) => (
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
      </Box>
    );
  }
}
