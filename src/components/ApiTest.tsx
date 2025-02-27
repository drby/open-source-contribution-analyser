import React, { FC, useState, useEffect } from 'react';
import { Box, Button, Code, Heading, Input, Stack, Text, VStack, useToast } from '@chakra-ui/react';
import { githubApi } from '../services/github/api';
import { Contributor, Repository } from '../services/github/types';
import config from '../config';

const ApiTest: FC = () => {
  const [owner, setOwner] = useState<string>('facebook');
  const [repo, setRepo] = useState<string>('react');
  const [result, setResult] = useState<{ repository?: Repository; contributors?: Contributor[] }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<string>('Checking token...');

  const toast = useToast();

  // Initialize the GitHub API with the token from env file
  useEffect(() => {
    const token = config.github.token;
    if (token) {
      githubApi.setToken(token);
      setTokenStatus("Token is set");
    } else {
      setTokenStatus('No token found in environment variables. API rate limits will be lower.');
    }
  }, []);

  const testGetRepository = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await githubApi.getRepository(owner, repo);
      setResult(prev => ({ ...prev, repository: data }));
      toast({
        title: 'Repository fetched',
        description: `Successfully fetched info for ${owner}/${repo}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error fetching repository: ${message}`);
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testGetContributors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await githubApi.getContributorsWithDetails(owner, repo);
      setResult(prev => ({ ...prev, contributors: data }));
      toast({
        title: 'Contributors fetched',
        description: `Successfully fetched ${data.length} contributors for ${owner}/${repo}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error fetching contributors: ${message}`);
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">GitHub API Test</Heading>

        <Box>
          <Text fontWeight="bold" mb={2}>GitHub Token Status:</Text>
          <Text
            fontSize="sm"
            color={tokenStatus.includes('⚠️') ? "orange.500" : "green.500"}
          >
            {tokenStatus}
          </Text>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>Repository to test:</Text>
          <Stack direction="row" mb={2}>
            <Input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Owner"
            />
            <Input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="Repository"
            />
          </Stack>
        </Box>

        <Stack direction="row" spacing={4}>
          <Button
            colorScheme="blue"
            onClick={testGetRepository}
            isLoading={isLoading}
          >
            Test Get Repository
          </Button>
          <Button
            colorScheme="green"
            onClick={testGetContributors}
            isLoading={isLoading}
          >
            Test Get Contributors
          </Button>
        </Stack>

        {error && (
          <Box p={3} bg="red.50" color="red.500" borderRadius="md">
            {error}
          </Box>
        )}

        {result.repository && (
          <Box>
            <Heading size="sm" mb={2}>Repository Information:</Heading>
            <Code p={2} borderRadius="md" display="block" whiteSpace="pre-wrap">
              {JSON.stringify(result.repository, null, 2)}
            </Code>
          </Box>
        )}

        {result.contributors && (
          <Box>
            <Heading size="sm" mb={2}>Contributors Information:</Heading>
            <Text mb={2}>Found {result.contributors.length} contributors</Text>
            <Box maxH="300px" overflowY="auto">
              <Code p={2} borderRadius="md" display="block" whiteSpace="pre-wrap">
                {JSON.stringify(result.contributors.slice(0, 3), null, 2)}
                {result.contributors.length > 3 && '... (more contributors)'}
              </Code>
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ApiTest;
