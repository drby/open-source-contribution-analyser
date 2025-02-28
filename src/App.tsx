import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {ApiTest, HomePage } from './pages';
import { Footer, Navbar } from './components';
import { Box, Container, Heading, Text } from '@chakra-ui/react';

const App: FC = () => {
  return (
    <Router>
      <Box minH="100vh" bg="gray.50">
        <Navbar />
        <Container maxW="100%" py={6}>
          <Box textAlign="center" mb={8}>
            <Heading as="h1" size="xl" mb={2}>
              Open-Source Contribution Analyzer
            </Heading>
            <Text color="gray.600">
              Analyze contributors and companies behind popular GitHub repositories
            </Text>
          </Box>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/api-test" element={<ApiTest />} />
          </Routes>
        </Container>
      </Box>
      <Footer />
    </Router>
  );
};

export default App;
