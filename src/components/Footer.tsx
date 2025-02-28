import { FC } from 'react';
import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const Footer: FC = () => {
  return (
    <Box
      as="footer"
      py={4}
      px={6}
      borderColor="gray.200"
      mt={8}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        maxW="100%"
        mx="auto"
        flexDir={{ base: 'column', md: 'row' }}
        gap={{ base: 3, md: 0 }}
      >
        <Box>
          <Link
            href="https://dev.to/ag2byte/create-react-app-is-officially-dead-h7o"
            isExternal
            color="gray.600"
            _hover={{ color: 'blue.500', textDecoration: 'none' }}
          >
            <Text display="flex" alignItems="center">
              RIP create-react-app <ExternalLinkIcon ml={1} />
            </Text>
          </Link>
        </Box>

        <Flex gap={4} alignItems="center">
          <Link
            href="https://www.linkedin.com/in/tomdrby"
            isExternal
            color="gray.600"
            _hover={{ color: 'blackAlpha.500', textDecoration: 'none' }}
          >
            <Text display="flex" alignItems="center">
              LinkedIn <ExternalLinkIcon ml={1} />
            </Text>
          </Link>

          <Link
            href="https://github.com/drby"
            isExternal
            color="gray.600"
            _hover={{  color: 'blackAlpha.500', textDecoration: 'none' }}
          >
            <Text display="flex" alignItems="center">
              GitHub <ExternalLinkIcon ml={1} />
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
