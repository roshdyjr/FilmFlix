import { Container, Flex, Grid, Heading, Select, Skeleton } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { fetchTvSeries } from '../../services/api';
import CardComponent from '../../components/CardComponent';
import Pagination from '../../components/Pagination';

const Shows = () => {

  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");

  useEffect(() => {
    setIsLoading(true);
    fetchTvSeries(activePage, sortBy).then((res) => {
      setShows(res?.results);
      setActivePage(res?.page);
      setTotalPages(res?.total_pages);
    }).catch((error) => {
      console.log(error);
    }).finally(() => setIsLoading(false))
  }, [activePage, sortBy]);


  return (
    <Container maxWidth={'container.xl'}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"} my={10}>
          discover tv shows
        </Heading>
        <Select w={"130px"} onChange={(e) => {
          setActivePage(1);
          setSortBy(e.target.value)
        }}>
          <option value="popularity.desc">Popular</option>
          <option value="vote_average.desc&vote_count.gte=1000">Top Rated</option>
        </Select>
      </Flex>

      <Grid templateColumns={{
        base: '1fr',
        sm: "repeat(2, 1fr)",
        md: 'repeat(4, 1fr)',
        lg: 'repeat(5, 1fr)'
      }} gap={"5"}>
        {shows && shows?.map((item, i) => (
          isLoading ? (
            <Skeleton height={300} key={i} />
          ) : (
            <CardComponent key={item?.id} item={item} type={"tv"} />
          )
        ))}
      </Grid>
      <Pagination activePage={activePage} totalPages={totalPages} setActivePage={setActivePage} />
    </Container>
  )
}

export default Shows