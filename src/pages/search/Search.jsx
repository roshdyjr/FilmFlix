import { Container, Flex, Grid, Heading, Input, InputGroup, InputRightElement, Skeleton, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { searchData } from '../../services/api';
import CardComponent from '../../components/CardComponent';
import Pagination from '../../components/Pagination';
import { Search2Icon } from '@chakra-ui/icons';

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tempSearchValue, setTempSearchValue] = useState("");

  useEffect(() => {
    setIsLoading(true);
    searchData(searchValue, activePage).then((res) => {
      setData(res?.results);
      setActivePage(res?.page);
      setTotalPages(res?.total_pages);
    }).catch((error) => console.log(error, "error")).finally(() => setIsLoading(false))
  }, [searchValue, activePage])


  const handleSearch = (e) => {
    e.preventDefault();
    setSearchValue(tempSearchValue);
  }

  return (
    <Container maxWidth={'container.xl'}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"}>
          search
        </Heading>
      </Flex>
      <Flex position={"relative"} width="100%">
        <form onSubmit={handleSearch} style={{ width: "100%" }}>
          <InputGroup>
            <Input
              mb={"6"}
              _placeholder={{ color: "gray.100" }}
              placeholder="Search movies, tv shows..."
              value={tempSearchValue}
              onChange={(e) => setTempSearchValue(e.target.value)}
            />
            <InputRightElement>
              <Search2Icon color="gray.400" cursor="pointer" onClick={handleSearch} />
            </InputRightElement>
          </InputGroup>
        </form>
      </Flex>
      {isLoading && (
        <Flex justifyContent={"center"} mt={"10"}>
          <Spinner size={"xl"} color='red' />
        </Flex>
      )}

      {data?.length === 0 && !isLoading && (
        <Heading textAlign={"center"} as={"h3"} fontSize={"sm"} mt={"10"}>No results found</Heading>
      )}

      <Grid templateColumns={{
        base: '1fr',
        sm: "repeat(2, 1fr)",
        md: 'repeat(4, 1fr)',
        lg: 'repeat(5, 1fr)'
      }} gap={"5"}>
        {data?.length > 0 && !isLoading &&
          data && data?.map((item, i) => (
            isLoading ? (
              <Skeleton height={300} key={i} />
            ) : (
              <CardComponent key={item?.id} item={item} type={item?.media_type} />
            )
          ))}
      </Grid>

      {data?.length > 0 && !isLoading && <Pagination activePage={activePage} totalPages={totalPages} setActivePage={setActivePage} />}
    </Container>
  )
}

export default Search;