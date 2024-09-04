import { Badge, Box, Button, CircularProgress, CircularProgressLabel, Container, Flex, Heading, Image, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCredits, fetchDetails, fetchTrailers, imagePath, imagePathOriginal } from '../services/api';
import { CalendarIcon, CheckCircleIcon, SmallAddIcon, TimeIcon } from '@chakra-ui/icons';
import { minutesToHours, ratingToPercentage, resolveRatingColor } from '../utils/helpers';
import VideoComponent from '../components/VideoComponent';
import { AuthContext } from '../context/authProvider';
import { useFirestore } from '../services/firestore';

const DetailsPage = () => {
    const router = useParams();
    const { type, id } = router;
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState({});
    const [credits, setCredits] = useState([]);
    const [trailer, setTrailer] = useState(null);
    const [videos, setVideos] = useState([]);
    const { user } = useContext(AuthContext);
    const toast = useToast();
    const { addToWatchList, checkIfInWatchlist, removeFromWatchlist } = useFirestore();
    const [isInWatchList, setIsInWatchList] = useState(false);




    useEffect(() => {
        const fetchData = async () => {
            try {
                const [detailsData, creditsData, videosData] = await Promise.all([
                    fetchDetails(type, id),
                    fetchCredits(type, id),
                    fetchTrailers(type, id),
                ])

                setDetails(detailsData);

                setCredits(creditsData?.cast?.slice(0, 10));

                const trailer = videosData?.results?.find((trailer) => trailer?.type === "Trailer");
                setTrailer(trailer);

                const videos = videosData?.results?.filter((video) => video?.type !== "Trailer").slice(0, 10);
                setVideos(videos);
            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [type, id]);

    const handleSaveToWatchList = async () => {
        if (!user) {
            toast({
                title: "Please login to add to watchlist",
                status: "error",
                isClosable: true,
            });
            return;
        }

        const data = {
            id: details?.id,
            title: details?.title || details?.name,
            type: type,
            poster_path: details?.poster_path,
            release_date: details?.release_date || details?.first_air_date,
            vote_average: details?.vote_average,
            overview: details?.overview
        }

        const dataId = details?.id?.toString();
        await addToWatchList(user?.uid, dataId, data);
        const isSetToWatchList = await checkIfInWatchlist(user?.uid, dataId);
        setIsInWatchList(isSetToWatchList);
    }

    const handleRemoveFromWatchList = async () => {
        await removeFromWatchlist(user?.uid, id);
        const isSetToWatchList = await checkIfInWatchlist(user?.uid, id);
        setIsInWatchList(isSetToWatchList);
    }


    useEffect(() => {
        if (!user) {
            setIsInWatchList(false);
            return;
        }

        checkIfInWatchlist(user?.uid, id).then((data) => {
            setIsInWatchList(data);
        })
    }, [user, id, checkIfInWatchlist]);



    if (loading) {
        return (
            <Flex justify={"center"} >
                <Spinner size={"xl"} color='red' />
            </Flex>
        )
    }

    const title = details?.title || details?.name;
    const releaseDate = type === "tv" ? details?.first_air_date : details?.release_date;

    return (
        <Box>
            <Box background={`linear-gradient(rgba(0,0,0,0.88), rgba(0,0,0,0.88)), url(${imagePathOriginal}/${details?.backdrop_path})`}
                backgroundRepeat={"no-repeat"}
                backgroundSize={"cover"}
                backgroundPosition={"center"}
                w={"100%"}
                h={{ base: "auto", md: "500px" }}
                py={"2"}
                display={"flex"}
                alignItems={"center"}
                zIndex={"-1"}
            >
                <Container maxWidth={"container.xl"}>
                    <Flex alignItems={"center"} gap={"10"} flexDirection={{ base: "column", md: "row" }}>
                        <Image height={"450px"} borderRadius={'sm'} src={`${imagePath}/${details?.poster_path}`} />
                        <Box>
                            <Heading fontSize={"3xl"}>
                                {title}
                                {" "}
                                <Text as={"span"} fontWeight={"normal"} color={"gray.400"}>
                                    {new Date(releaseDate).getFullYear()}
                                </Text>
                            </Heading>

                            <Flex alignItems={"center"} gap={"4"} mt={"1"} mb={"5"}>
                                <Flex alignItems={"center"}>
                                    <CalendarIcon mr={2} color={"gray.400"} />
                                    <Text fontSize={"sm"}>
                                        {new Date(releaseDate).toLocaleDateString("en-US")} (US)
                                    </Text>
                                </Flex>
                                {type === "movie" && (
                                    <>
                                        <Box>
                                            *
                                        </Box>
                                        <Flex alignItems={"center"}>
                                            <TimeIcon mr={"2"} color={"gray.400"} />
                                            <Text fontSize={"sm"}>{minutesToHours(details?.runtime)}</Text>
                                        </Flex>
                                    </>
                                )}
                            </Flex>



                            <Flex alignItems={"center"} gap={"4"}>
                                <CircularProgress
                                    value={ratingToPercentage(details?.vote_average)}
                                    bg={"gray.800"}
                                    borderRadius={"full"}
                                    p={"0.5"}
                                    size={"70px"}
                                    color={resolveRatingColor(details?.vote_average)}
                                    thickness={"6px"}
                                >
                                    <CircularProgressLabel fontSize={"lg"}>
                                        {ratingToPercentage(details?.vote_average)} {" "}
                                        <Box as='span' fontSize={"10px"}>
                                            %
                                        </Box>
                                    </CircularProgressLabel>
                                </CircularProgress>
                                <Text display={{ base: "none", md: "initial" }}>
                                    User Score
                                </Text>
                                {isInWatchList ? (<Button leftIcon={<CheckCircleIcon />} colorScheme='green' variant={"outline"} onClick={handleRemoveFromWatchList}>
                                    In watchlist
                                </Button>) : (<Button leftIcon={<SmallAddIcon />} variant={"outline"} onClick={handleSaveToWatchList}>
                                    Add to watchlist
                                </Button>)}
                            </Flex>

                            <Text color={"gray.400"} fontSize={"sm"} my={"5"} fontStyle={"italic"}>{details?.tagline}</Text>
                            <Heading fontSize={"xl"} mb={"3"}>Overview</Heading>
                            <Text fontSize={'md'} mb={"3"}>{details?.overview}</Text>
                            <Flex mt={"6"} gap={"2"}>
                                {details?.genres?.map((genre) => (
                                    <Badge key={genre?.id} p={"1"}>{genre?.name}</Badge>
                                ))}
                            </Flex>
                        </Box>
                    </Flex>
                </Container>
            </Box>
            <Container maxW={"container.xl"} pb={"10"}>
                <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"} mt={"10"}>
                    cast
                </Heading>
                <Flex mt={"5"} mb={"10"} overflowX={"scroll"} gap={"5"}>
                    {credits?.length === 0 && <Text>No cast found</Text>}
                    {credits && credits.map((item) => (
                        <Box key={item.id} minW={"150px"}>
                            <Image src={`${imagePath}/${item?.profile_path}`} w={"100%"} height={"250px"} borderRadius={"sm"} />
                        </Box>
                    ))}
                </Flex>
                <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"} mt={"10"} mb={"5"}>
                    Videos
                </Heading>
                <VideoComponent id={trailer?.key} title={trailer?.name} />
                <Flex mt={"5"} mb={"10"} overflowX={"scroll"} gap={"5"}>
                    {videos && videos.map((video) => (
                        <Box key={video?.id} minW={"300px"}>
                            <VideoComponent id={video?.key} small title={video?.name}></VideoComponent>
                            <Text fontSize={"sm"} fontWeight={"bold"} mt={"2"} noOfLines={2}>
                                {video?.name} {" "}
                            </Text>
                        </Box>
                    ))}
                </Flex>
            </Container>
        </Box>
    )
}

export default DetailsPage