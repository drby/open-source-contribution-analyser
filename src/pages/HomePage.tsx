import { FC, useState } from 'react';

import {
  RepositoryForm,
  RepositoryInfo,
  ContributorsTable,
  SummaryTable
} from '../components';
import RecentSearches from '../components/RecentSearches';
import { Box, Heading, Text, VStack, Flex, Alert, AlertIcon } from '@chakra-ui/react';

import { Repository, Contributor } from '../services/github/types/types';
import { githubApi } from '../services/github/api';

const HomePage: FC = () => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentOwner, setCurrentOwner] = useState<string>('');
  const [currentRepo, setCurrentRepo] = useState<string>('');

  const handleSelectRecentSearch = async (owner: string, repo: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentOwner(owner);
      setCurrentRepo(repo);

      const repoData = await githubApi.getRepository(owner, repo);
      setRepository(repoData);

      const contributorData = await githubApi.getContributorsWithDetails(owner, repo);
      setContributors(contributorData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred, maybe the mighty doge can help');
      setRepository(null);
      setContributors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (owner: string, repo: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentOwner(owner);
      setCurrentRepo(repo);

      const repoData = await githubApi.getRepository(owner, repo);
      setRepository(repoData);

      const contributorData = await githubApi.getContributorsWithDetails(owner, repo);
      setContributors(contributorData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setRepository(null);
      setContributors([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={4}>Repository Analysis</Heading>
        <Text mb={4}>
          Enter a GitHub repository to see contributors and which
          companies and locations are most represented.
        </Text>
      </Box>

      <RepositoryForm
        onSubmit={handleFormSubmit}
        setIsLoading={setIsLoading}
        setError={setError}
      />

      <RecentSearches onSelectSearch={handleSelectRecentSearch} />

      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {repository && (
        <RepositoryInfo
          repository={repository}
          owner={currentOwner}
          repo={currentRepo}
        />
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
