import { FC, useState } from 'react';

import {RepositoryForm, RepositoryInfo, ContributorsTable, SummaryTable} from '../components';
import { Box, Heading, Text, VStack, Flex, Alert, AlertIcon } from '@chakra-ui/react';

import { Repository, Contributor } from '../services/github/types/types';

const HomePage: FC = () => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={4}>Repository Analysis</Heading>
        <Text mb={4}>
          Enter a GitHub repository to analyze its contributors and determine which
          companies and locations are most represented.
        </Text>
      </Box>

      <RepositoryForm
        setRepository={setRepository}
        setContributors={setContributors}
        setIsLoading={setIsLoading}
        setError={setError}
      />

      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {repository && (
        <RepositoryInfo repository={repository} />
      )}

      {contributors.length > 0 && (
        <Flex gap={4} direction={{ base: 'column', lg: 'row' }}>
          <ContributorsTable
            contributors={contributors}
            isLoading={isLoading}
          />
          <SummaryTable
            contributors={contributors}
          />
        </Flex>
      )}
    </VStack>
  );
};

export default HomePage;
