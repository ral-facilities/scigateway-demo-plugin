import React from 'react';
import { Card, CardHeader, CardContent, Box } from '@mui/material';
import JSONPretty from 'react-json-pretty';

interface MessageListenerComponentState {
  data: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  messages: any[];
}

export default class MessageListenerComponent extends React.Component<
  Record<string, never>,
  MessageListenerComponentState
> {
  public constructor() {
    super({});
    this.state = {
      messages: [],
      data: '{}',
    };

    document.addEventListener('scigateway', (event) => {
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
      <Box sx={{ width: '100%', paddingRight: 5 }}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Micro-frontend global message listener" />
          <CardContent sx={{ background: '#eee', margin: 20 }}>
            <JSONPretty id="json-pretty" json={this.state.data} />
          </CardContent>
        </Card>
      </Box>
    );
  }
}
