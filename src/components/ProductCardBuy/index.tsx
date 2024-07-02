import { Box, Flex, Stack, Image, Text } from '@chakra-ui/react';

const ProductCardBuy = ({ image, title, description, price }: any) => {
    return (
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Flex>
          <Image src={image} alt={title} boxSize="150px" objectFit="cover" />
  
          <Box p="6">
            <Stack spacing={3}>
              <Text fontWeight="bold" fontSize="xl">
                {title}
              </Text>
              <Text>{description}</Text>
              <Text fontWeight="bold" fontSize="lg" color="teal.600">
                R$ {price}
              </Text>
            </Stack>
          </Box>
        </Flex>
      </Box>
    );
};
  
  export default ProductCardBuy;