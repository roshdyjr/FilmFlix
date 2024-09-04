import { Avatar, Box, Button, Container, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/authProvider';
import { HamburgerIcon, SearchIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { user, signInWithGoogle, logout } = useContext(AuthContext);
  const { onOpen, isOpen, onClose } = useDisclosure();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      console.log("success")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box py="4" mb="2">
      <Container maxWidth={'container.xl'}>
        <Flex justifyContent={"space-between"}>
          <Link to='/'>
            <Box fontSize={"2xl"} fontWeight={"bold"} color={"red"} letterSpacing={"widest"} fontFamily={"mono"}>FILMFLIX</Box>
          </Link>
          <Flex gap={"4"} alignItems={"center"} display={{ base: "none", md: "flex" }}>
            <Link to="/">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/shows">TV Shows</Link>
            <Link to="/search">
              <SearchIcon fontSize={"xl"} />
            </Link>
            {user && (
              <Menu>
                <MenuButton>
                  <Avatar src={user?.photoURL} bg={"red.500"} color={"white"} size={"sm"} name={user?.displayName} />
                </MenuButton>
                <MenuList>
                  <Link to={"/watchlist"}>
                    <MenuItem>
                      Watchlist
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}
            {!user && (
              <Avatar size={"sm"} bg={"gray.800"} as={"button"} onClick={handleGoogleLogin} />
            )}
          </Flex>

          {/* {Mobile} */}

          <Flex
            display={{ base: "flex", md: "none" }}
            alignItems={"center"}
            gap="4"
          >
            <Link to="/search">
              <SearchIcon fontSize={"xl"} />
            </Link>
            <IconButton onClick={onOpen} icon={<HamburgerIcon />} />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent bg={"black"}>
                <DrawerCloseButton />
                <DrawerHeader>
                  {user ? (
                    <Flex alignItems="center" gap="2">
                      <Avatar src={user?.photoURL} bg={"red.500"} color={"white"} size={"sm"} name={user?.displayName} />
                      <Box fontSize={"sm"}>
                        {user?.displayName || user?.email}
                      </Box>
                    </Flex>
                  ) : (
                    <Avatar
                      size={"sm"}
                      bg="gray.800"
                      as="button"
                      onClick={handleGoogleLogin}
                    />
                  )}
                </DrawerHeader>

                <DrawerBody>
                  <Flex flexDirection={"column"} gap={"4"} onClick={onClose}>
                    <Link to="/">Home</Link>
                    <Link to="/movies">Movies</Link>
                    <Link to="/shows">TV Shows</Link>
                    {user && (
                      <>
                        <Link to="/watchlist">Watchlist</Link>
                        <Button
                          variant={"outline"}
                          colorScheme="red"
                          onClick={logout}
                        >
                          Logout
                        </Button>
                      </>
                    )}
                  </Flex>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar