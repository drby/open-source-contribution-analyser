import { FC, useMemo } from 'react';

import {
  Box,
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Flex,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { ChartModal } from '../components';
import { InfoIcon } from '@chakra-ui/icons';

import { Contributor } from '../services/github/types/types';

interface SummaryTablesProps {
  contributors: Contributor[];
}

interface SummaryItem {
  name: string;
  count: number;
  percentage: number;
}

const SummaryTables: FC<SummaryTablesProps> = ({ contributors }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const companySummary = useMemo(() => {
    const companyContributions: Record<string, number> = {};
    let totalContributions = 0;

    contributors.forEach(contributor => {
      const company = contributor.company ? contributor.company.trim() : 'Unknown';
      companyContributions[company] = (companyContributions[company] || 0) + contributor.contributions;
      totalContributions += contributor.contributions;
    });

    const summary: SummaryItem[] = Object.entries(companyContributions)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / totalContributions) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10

    return summary;
  }, [contributors]);

  const locationSummary = useMemo(() => {
    const locationCounts: Record<string, number> = {};

    contributors.forEach(contributor => {
      const location = contributor.location ? contributor.location.trim() : 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    const summary = Object.entries(locationCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / contributors.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10

    return summary;
  }, [contributors]);

  // Prepare data for charts
  const companyChartData = companySummary.map(item => ({
    name: item.name,
    value: item.count,
    percentage: item.percentage
  }));

  const locationChartData = locationSummary.map(item => ({
    name: item.name,
    value: item.count,
    percentage: item.percentage
  }));

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="sm" width="33%">
      <VStack spacing={6} align="stretch">
        <Box>
          <Flex justifyContent="space-between" alignItems="center" mb={3}>
            <Heading size="md">Top Companies</Heading>
            <IconButton
              icon={<InfoIcon />}
              aria-label="View charts"
              size="sm"
              colorScheme="blue"
              variant="ghost"
              onClick={onOpen}
            />
          </Flex>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Company</Th>
                <Th isNumeric>Contributions</Th>
                <Th isNumeric>%</Th>
              </Tr>
            </Thead>
            <Tbody>
              {companySummary.map((item, index) => (
                <Tr key={index}>
                  <Td>
                    <Text fontSize="sm" fontWeight={index < 3 ? "bold" : "normal"}>
                      {item.name === 'Unknown' ?
                        <Text as="span" color="gray.500">Unknown</Text> :
                        item.name}
                    </Text>
                  </Td>
                  <Td isNumeric>{item.count}</Td>
                  <Td isNumeric>
                    <Badge colorScheme={index < 3 ? "green" : "gray"}>
                      {item.percentage.toFixed(1)}%
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box>
          <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Heading size="md" mb={3}>Top Locations</Heading>
          <IconButton
              icon={<InfoIcon />}
              aria-label="View charts"
              size="sm"
              colorScheme="blue"
              variant="ghost"
              onClick={onOpen}
            />
          </Flex>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Location</Th>
                <Th isNumeric>Contributors</Th>
                <Th isNumeric>%</Th>
              </Tr>
            </Thead>
            <Tbody>
              {locationSummary.map((item, index) => (
                <Tr key={index}>
                  <Td>
                    <Text fontSize="sm" fontWeight={index < 3 ? "bold" : "normal"}>
                      {item.name === 'Unknown' ?
                        <Text as="span" color="gray.500">Unknown</Text> :
                        item.name}
                    </Text>
                  </Td>
                  <Td isNumeric>{item.count}</Td>
                  <Td isNumeric>
                    <Badge colorScheme={index < 3 ? "blue" : "gray"}>
                      {item.percentage.toFixed(1)}%
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      <ChartModal
        isOpen={isOpen}
        onClose={onClose}
        companyData={companyChartData}
        locationData={locationChartData}
      />
    </Box>
  );
};

export default SummaryTables;
