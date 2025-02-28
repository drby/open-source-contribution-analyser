import { FC, useEffect, useState } from 'react';

import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Flex,
  Badge,
  IconButton,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { CloseIcon, StarIcon } from '@chakra-ui/icons';

import { RecentSearch, getRecentSearches, removeRecentSearch } from '../services/recentSearches';

interface RecentSearchesProps {
  onSelectSearch: (owner: string, repo: string) => void;
}

const RecentSearches: FC<RecentSearchesProps> = ({ onSelectSearch }) => {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const toast = useToast();

  // Load recent searches on page load and refresh when localStorage changes
  useEffect(() => {
    const loadSearches = () => {
      setSearches(getRecentSearches());
    };

    loadSearches();

    // Set up event listener for storage changes (in case multiple tabs are open)
    window.addEventListener('storage', loadSearches);

    return () => {
      window.removeEventListener('storage', loadSearches);
    };
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle removing a search
  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent card's onClick
    removeRecentSearch(id);
    setSearches(getRecentSearches());

    toast({
      title: "Search removed",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  if (searches.length === 0) {
    return null;
  }

  return (
    <Box mt={6}>
      <Heading size="md" mb={3}>Recent Searches</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {searches.map((search) => (
          <Card
            key={search.id}
            cursor="pointer"
            onClick={() => onSelectSearch(search.owner, search.repo)}
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <CardBody position="relative">
              <Tooltip label="Remove from recent searches" placement="top">
                <IconButton
                  size="xs"
                  icon={<CloseIcon />}
                  aria-label="Remove search"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={(e) => handleRemove(search.id, e)}
                  colorScheme="red"
                  variant="ghost"
                />
              </Tooltip>

              <Heading size="sm" mb={2}>
                {search.owner}/{search.repo}
              </Heading>

              <Text fontSize="sm" color="gray.600" noOfLines={2} mb={2}>
                {search.repository.description || 'No description available'}
              </Text>

              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center">
                  <StarIcon color="yellow.400" mr={1} />
                  <Text fontSize="sm">
                    {search.repository.stargazers_count.toLocaleString()}
                  </Text>
                </Flex>

                <Badge colorScheme="blue" fontSize="xs">
                  {search.repository.language || 'N/A'}
                </Badge>
              </Flex>

              <Text fontSize="xs" color="gray.500" mt={2}>
                Searched on {formatDate(search.timestamp)}
              </Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RecentSearches;
