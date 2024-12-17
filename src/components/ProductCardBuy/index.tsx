import { Box, Flex, Stack, Image, Text, Button, Divider } from '@chakra-ui/react';

const ProductCardBuy = ({ image, title, description, price, discount }: any) => {
    return (
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Flex direction="row">
          <Image src={image} alt={title} maxW={{ base: '100%', sm: '200px' }} objectFit="cover" />

          
  
          <Box p="6" flex="1">
            <Stack spacing={3}>
              <Text fontWeight="bold" fontSize="xl">
                {title}
              </Text>
              
              <Stack>
                <Text className="risk" color='grey' textDecorationLine="line-through">
                  De: R${price.toFixed(2)}
                </Text>
                <Text color='blue.600' fontSize='2xl'>
                  Por: R${(price - (price * discount)).toFixed(2)}
                </Text>
                <Button variant='solid' colorScheme='blue'>
                  Comprar
                </Button>
              </Stack>

            </Stack>

            <Divider my={4} color='blue.600' />
            <Text>{description}</Text>


          </Box>
          
        </Flex>
      </Box>
    );
};
  
  export default ProductCardBuy;