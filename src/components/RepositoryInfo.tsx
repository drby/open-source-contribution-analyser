import { FC } from 'react';

import {
  Box,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Badge,
  Flex,
  Icon,
  Divider,
  Button,
  useToast
} from '@chakra-ui/react';
import { StarIcon, PlusSquareIcon } from '@chakra-ui/icons';

import { Repository } from '../services/github/types/types';
import { saveRecentSearch } from '../services/recentSearches';

interface RepositoryInfoProps {
  repository: Repository;
  owner: string;
  repo: string;
}

const RepositoryInfo: FC<RepositoryInfoProps> = ({ repository, owner, repo }) => {
  const toast = useToast();

  const handleSaveSearch = () => {
    saveRecentSearch(owner, repo, repository);
    toast({
      title: "Search saved",
      description: "This repository has been added to your recent searches",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={5} bg="white" borderRadius="md" boxShadow="sm">
      <Flex justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Heading size="lg">{repository.name}</Heading>
          <Text color="gray.600" mt={1}>{repository.description || 'No description provided'}</Text>
        </Box>
        <Flex alignItems="center">
          {repository.language && (
            <Badge colorScheme="blue" mr={2} px={2} py={1}>
              {repository.language}
            </Badge>
          )}
          {repository.license && (
            <Badge colorScheme="green" px={2} py={1}>
              {repository.license.name}
            </Badge>
          )}
        </Flex>
      </Flex>

      <Divider my={4} />

      <Flex justifyContent="space-between" alignItems="center">
        <StatGroup flex="1">
          <Stat>
            <StatLabel>Stars</StatLabel>
            <StatNumber>
              <Flex alignItems="center">
                <Icon as={StarIcon} color="yellow.400" mr={1} />
                {repository.stargazers_count.toLocaleString()}
              </Flex>
            </StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Followers</StatLabel>
            <StatNumber>{repository.subscribers_count.toLocaleString()}</StatNumber>
          </Stat>
        </StatGroup>

        <Button
          leftIcon={<PlusSquareIcon />}
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={handleSaveSearch}
        >
          Save to Recent
        </Button>
      </Flex>
    </Box>
  );
};

export default RepositoryInfo;
