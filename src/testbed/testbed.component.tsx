import React from 'react';
import { Card, CardHeader, CardContent, styled, Box } from '@mui/material';
import MessageListenerComponent from './messageListener.component';
import MessageSenderComponent from './messageSender.component';

const StyledDiv = styled('div')({
  display: 'flex',
  background: '#aaa',
  padding: 20,
  flexDirection: 'column',
  minHeight: '100vh',
});

interface TestBedComponentProps {
  pluginName: string;
  children?: React.ReactElement;
}

const TestBedComponent = (props: TestBedComponentProps): React.ReactElement => (
  <StyledDiv>
    <Card sx={{ width: '100%' }}>
      <CardHeader
        title={props.pluginName}
        subheader="Mounted in plugin testbed"
      />
      <CardContent sx={{ margin: 5, border: '1px dashed black' }}>
        {props.children}
      </CardContent>
    </Card>
    <Box sx={{ display: 'flex', marginTop: 10 }}>
      <MessageListenerComponent />
      <MessageSenderComponent />
    </Box>
  </StyledDiv>
);

export default TestBedComponent;
