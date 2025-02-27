import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Container, Flex, Heading, Text, Button, Stack } from '@chakra-ui/react';
import ApiTest from './components/ApiTest';
import HomePage from './components/HomePage';

const App: React.FC = () => {
  return (
    <Router>
      <Container maxW="container.lg" py={8}>
        <Box textAlign="center" mb={8}>
          <Heading as="h1" size="xl" mb={2}>
            Open-Source Contribution Analyzer
          </Heading>
          <Text color="gray.600" mb={6}>
            Analyze contributors and companies behind popular GitHub repositories
          </Text>

          <Flex justify="center" gap={4}>
            <Link to="/">
              <Button colorScheme="blue">Home</Button>
            </Link>
            <Link to="/api-test">
              <Button colorScheme="gray">API Tester</Button>
            </Link>
          </Flex>
        </Box>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/api-test" element={<ApiTest />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;