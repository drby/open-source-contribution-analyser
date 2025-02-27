import React, { useState } from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import RepositoryForm from './RepositoryForm';
import { Repository, Contributor } from '../services/github/types';

const HomePage: React.FC = () => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Heading size="md" mb={4}>Repository Analysis</Heading>
        <Text mb={4}>
        </Text>
      </Box>

      <RepositoryForm
        setRepository={setRepository}
        setContributors={setContributors}
        setIsLoading={setIsLoading}
        setError={setError}
      />

      {error && (
        <Box p={4} bg="red.50" color="red.500" borderRadius="md">
          {error}
        </Box>
      )}

      {/* Placeholder for repository information and contributor display */}
      {repository && (
        <Box p={4} bg="gray.50" borderRadius="md">
          <Heading size="sm" mb={2}>{repository.name}</Heading>
          <Text>{repository.description}</Text>
          <Text mt={2}>
            Contributors loaded: {contributors.length}
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default HomePage;