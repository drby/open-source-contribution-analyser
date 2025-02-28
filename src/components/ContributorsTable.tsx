import { FC } from 'react';

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
  Heading,
  Flex,
  Spinner,
  Badge,
} from '@chakra-ui/react';

import { Contributor } from '../services/github/types/types';

interface ContributorTableProps {
  contributors: Contributor[];
  isLoading: boolean;
}

const ContributorsTable: FC<ContributorTableProps> = ({ contributors, isLoading }) => {
  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="sm" width="65%">
      <Heading size="md" mb={4}>
        Top Contributors
      </Heading>

      <Box maxHeight="600px" overflowY="auto" position="relative">
        {isLoading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Table variant="simple" size="sm">
            <Thead
              position="sticky"
              top={0}
              bg="white"
              zIndex={1}
              boxShadow="0 1px 2px rgba(0, 0, 0, 0.1)"
            >
              <Tr>
                <Th px={3} py={3}>User</Th>
                <Th px={3} py={3} isNumeric>Contributions</Th>
                <Th px={3} py={3}>Company</Th>
                <Th px={3} py={3}>Location</Th>
              </Tr>
            </Thead>
            <Tbody>
              {contributors.map((contributor) => (
                <Tr key={contributor.id}>
                  <Td>
                    <Flex align="center">
                      <Avatar size="sm" src={contributor.avatar_url} mr={2} />
                      <Box>
                        <Text fontWeight="bold">{contributor.login}</Text>
                        <Text fontSize="xs" color="gray.600">{contributor.name || '-'}</Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td isNumeric>
                    <Badge colorScheme="blue" fontSize="sm">
                      {contributor.contributions}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize="sm">{contributor.company || '-'}</Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">{contributor.location || '-'}</Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default ContributorsTable;
