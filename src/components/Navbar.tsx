import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Box,
  Flex,
  HStack,
  Button,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';

const Navbar: FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={10}
      bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')}
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      px={4}
      py={2}
    >
      <Flex alignItems="center" justifyContent="space-between" maxW="100%" mx="auto">
        <Link to="/">
          <Flex alignItems="center">
            <Image
              src="/logo.svg"
              alt="Logo"
              h="36px"
              mr={2}
              fallback={
                <Box
                  w="36px"
                  h="36px"
                  bg="gray.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="md"
                  fontSize="xs"
                  color="gray.500"
                >
                  LOGO
                </Box>
              }
            />
          </Flex>
        </Link>

        <HStack spacing={4}>
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              fontWeight={isActive('/') ? "semibold" : "normal"}
              borderBottom={isActive('/') ? "2px solid" : "none"}
              borderRadius="0"
              _hover={{ bg: 'transparent', color: 'blackAlpha.500' }}
            >
              Home
            </Button>
          </Link>
          <Link to="/api-test">
            <Button
              variant="ghost"
              size="sm"
              fontWeight={isActive('/api-test') ? "semibold" : "normal"}
              borderBottom={isActive('/api-test') ? "2px solid" : "none"}
              borderRadius="0"
              _hover={{ bg: 'transparent', color: 'blackAlpha.500' }}
            >
              API Tester
            </Button>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
