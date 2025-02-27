import React, { FC } from 'react';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import ApiTest from './components/ApiTest';

const App: FC = () => {
  return (
    <Container maxW="container.lg" py={8}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          Open-Source Contribution Analyzer
        </Heading>
        <Text color="gray.600">
          Testing the GitHub API Integration
        </Text>
      </Box>

      <ApiTest />
    </Container>
  );
};

export default App;