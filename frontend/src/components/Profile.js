import { Box, Image, Text, VStack } from '@chakra-ui/react';
import Posts from './Posts';

const Profile = () => {
  return (
    <Box>
      <VStack p={7} m="auto" width="fit-content" borderRadius={6} bg="gray.700">
        <Image
          borderRadius="full"
          boxSize="80px"
          src="https://bucket-avatarr.s3.us-east-1.amazonaws.com/123/47b56a2f-1362-4572-a0f2-775a3ee1ce10"
          alt="Profile"
        />
        <Text>JuanesCode</Text>
        <Text fontSize="lg" color="gray.400">
          Software Engineer
        </Text>
      </VStack>

      <Posts />
    </Box>
  );
};
export default Profile;
