import { useToast } from "@chakra-ui/react";
import { db } from "../services/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useCallback } from "react";

export const useFirestore = () => {
  const toast = useToast();
  const addDocument = async (collectionName, data) => {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  };

  const addToWatchList = async (userId, dataId, data) => {
    if (await checkIfInWatchlist(userId, dataId)) {
      toast({
        title: "Error",
        description: "This item is already in your watchlist",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    try {
      await setDoc(doc(db, "users", userId, "watchlist", dataId), data);
      toast({
        title: "Success",
        description: "Added to watchlist",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.log(error, "error adding document");
      toast({
        title: "Error",
        description: "An error occurred",
        status: "error",
        isClosable: true,
      });
    }
  };

  const checkIfInWatchlist = async (userId, dataId) => {
    const docRef = doc(
      db,
      "users",
      userId?.toString(),
      "watchlist",
      dataId?.toString()
    );
    const docSnap = await getDoc(docRef);

    return docSnap.exists();
  };

  const removeFromWatchlist = async (userId, dataId) => {
    try {
      await deleteDoc(
        doc(db, "users", userId?.toString(), "watchlist", dataId?.toString())
      );
      toast({
        title: "Success",
        description: "Item removed from watchlist",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Couldn't remove item from watchlist",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    }
  };

  const getWatchlist = useCallback(async (userId) => {
    const querySnapshot = await getDocs(
      collection(db, "users", userId?.toString(), "watchlist")
    );

    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return data;
  }, []);

  return {
    addDocument,
    addToWatchList,
    checkIfInWatchlist,
    removeFromWatchlist,
    getWatchlist,
  };
};
