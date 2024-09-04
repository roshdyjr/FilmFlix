import { useContext, useState, useEffect } from 'react';
import { useFirestore } from '../services/firestore'
import { AuthContext } from '../context/authProvider';
import { Container, Flex, Grid, Heading, Spinner } from '@chakra-ui/react';
import WatchlistCard from '../components/WatchListCard';

const Watchlist = () => {

  const { getWatchlist } = useFirestore();
  const { user } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getWatchlist(user?.uid).then((data) => {
        setWatchlist(data);
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        setIsLoading(false);
      })
    }
  }, [user.uid, getWatchlist]);

  return (
    <Container maxWidth={'container.xl'}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"}>
          Watchlist
        </Heading>
      </Flex>

      {isLoading && (
        <Flex justifyContent={"center"} mt={"10"}>
          <Spinner color='red' size={"xl"} />
        </Flex>
      )}
      {isLoading && watchlist?.length === 0 && (
        <Flex justifyContent={"center"} mt={"10"}>
          <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"}>Your watchlist is empty!</Heading>
        </Flex>
      )}
      {!isLoading && watchlist?.length > 0 && (
        <Grid my={"10"} templateColumns={{ base: "1fr" }} gap={"5"}>
          {watchlist?.map((item) => (
            <WatchlistCard key={item.id} item={item} type={item?.type} setWatchlist={setWatchlist} />
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default Watchlist;