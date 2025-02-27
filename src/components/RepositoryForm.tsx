import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { githubApi } from '../services/github/api';
import { Contributor, Repository } from '../services/github/types';

interface RepositoryFormProps {
  setRepository: React.Dispatch<React.SetStateAction<Repository | null>>;
  setContributors: React.Dispatch<React.SetStateAction<Contributor[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

interface FormValues {
  owner: string;
  repo: string;
}

const RepositoryForm:FC<RepositoryFormProps> = ({
  setRepository,
  setContributors,
  setIsLoading,
  setError,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      owner: '',
      repo: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch repository data
      const repoData = await githubApi.getRepository(values.owner, values.repo);
      setRepository(repoData);

      // Fetch contributor data with details
      const contributorData = await githubApi.getContributorsWithDetails(values.owner, values.repo);
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
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={6} bg="white" borderRadius="md" boxShadow="sm">
      <VStack spacing={4} align="stretch">
        <HStack spacing={4} align="flex-start">
          <FormControl isInvalid={!!errors.owner}>
            <FormLabel htmlFor="owner">Repository Owner</FormLabel>
            <Input
              id="owner"
              placeholder="e.g., facebook"
              {...register('owner', {
                required: 'Owner is required',
              })}
            />
            <FormErrorMessage>{errors.owner?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.repo}>
            <FormLabel htmlFor="repo">Repository Name</FormLabel>
            <Input
              id="repo"
              placeholder="e.g., react"
              {...register('repo', {
                required: 'Repository name is required',
              })}
            />
            <FormErrorMessage>{errors.repo?.message}</FormErrorMessage>
          </FormControl>
        </HStack>

        <Button
          mt={4}
          colorScheme="blue"
          isLoading={isSubmitting}
          type="submit"
        >
          Analyze Repository
        </Button>
      </VStack>
    </Box>
  );
};

export default RepositoryForm;
