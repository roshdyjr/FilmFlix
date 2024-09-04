import { Box, Container, Flex, Grid, Heading, Image, Skeleton } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { fetchTrending, imagePath } from '../services/api'
import CardComponent from '../components/CardComponent'

const Home = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeWindow, setTimeWindow] = useState("day");


    useEffect(() => {
        setLoading(true);
        fetchTrending(timeWindow).then((res) => {
            setData(res)
        }).catch((err) => {
            console.log(err, "error")
        }).finally(() => {
            setLoading(false);
        })
    }, [timeWindow])


    return (
        <Container maxWidth={'container.xl'}>
            <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
                <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"}>
                    trending
                </Heading>
                <Flex alignItems={"center"} gap={"2"} border={"1px solid teal"} borderRadius={"20px"}>
                    <Box as='button' px={"3"} py={"1"} borderRadius={"20px"} onClick={() => { setTimeWindow("day") }} bg={`${timeWindow === "day" ? "gray.700" : ""}`}>Today</Box>
                    <Box as='button' px={"3"} py={"1"} borderRadius={"20px"} onClick={() => { setTimeWindow("week") }} bg={`${timeWindow === "week" ? "gray.700" : ""}`}>This Week</Box>
                </Flex>
            </Flex>

            <Grid templateColumns={{
                base: '1fr',
                sm: "repeat(2, 1fr)",
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)'
            }} gap={"5"}>
                {data && data?.map((item, i) => (
                    loading ? (
                        <Skeleton height={300} key={i} />
                    ) : (
                        <CardComponent key={item?.id} item={item} type={item?.media_type} />
                    )
                ))}
            </Grid>
        </Container>
    )
}

export default Home