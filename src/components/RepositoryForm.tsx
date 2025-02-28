import { Dispatch, FC, SetStateAction } from 'react';

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
import { useForm } from 'react-hook-form';

interface RepositoryFormProps {
  onSubmit: (owner: string, repo: string) => Promise<void>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

interface FormValues {
  owner: string;
  repo: string;
}

const RepositoryForm: FC<RepositoryFormProps> = ({
  onSubmit,
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

  const handleFormSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values.owner, values.repo);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(handleFormSubmit)} p={6} bg="white" borderRadius="md" boxShadow="sm">
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
