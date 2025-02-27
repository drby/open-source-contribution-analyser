import React, { FC } from 'react';
import { Box, Heading } from '@chakra-ui/react';

const App: FC = () => {
  return (
    <Box p={5} bg="red.100" m={5}>
      <Heading>Hello World</Heading>
    </Box>
  );
};

export default App;