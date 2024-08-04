'use client'
import Image from "next/image";
import { useState, useEffect  } from "react";
//import { firestore } from "@/firebase";
import { firestore, auth } from "@/firebase";
import { Box, Modal, Stack, TextField, Typography, Button,InputAdornment} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { collection,getDocs, query,doc, deleteDoc, getDoc,setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const imageMap = {
  'whole chicken': '/whole chicken.jpeg',
  'carrots': '/carrots.jpeg',
  'ginger': '/ginger.jpeg',
  'milk': '/milk.jpeg',
  'garlic': '/garlic.jpeg',
  'potatoes': '/potatoes.jpeg',
  'oranges': '/oranges.jpeg',
  'red onions': '/red onions.jpeg',
  'white onions': '/white onions.jpeg',
  'whiskey': '/whiskey.jpeg',
  'eggs': '/eggs.jpeg',
  'apples': '/apples.jpeg',
  'tomatoes': '/tomatoes.jpeg',
  'vodka':'/vodka.jpeg',
  'rum':'/rum.jpeg',
  'jalapenos':'/jalapenos.jpeg',
  
  
  // Add more mappings as needed
};
 
export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open , setOpen] = useState(false);
  const [itemName , setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('signin');
  const [started, setStarted] = useState(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
     docs.forEach((doc) =>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
     })
     setInventory(inventoryList);
     setFilteredInventory(inventoryList);
  }

  const addItem = async (item, quantity) => {
    if(!item|| !quantity||quantity<=0) return;
    const itemNameLower = item.toLowerCase();
    const docRef = doc(collection(firestore,"inventory"), itemNameLower )
    const docSnap = await getDoc(docRef)
    if(docSnap.exists() ){
     const {quantity: existingQuantity} =docSnap.data();
       await setDoc(docRef,{quantity:  existingQuantity + quantity})
     }
     else{
      await setDoc(docRef,{quantity: quantity})
     }
    await updateInventory()
 }

  const removeItem = async (item) => {
    const itemNameLower = item.toLowerCase(); 
    const docRef = doc(collection(firestore, "inventory"), itemNameLower);
     const docSnap = await getDoc(docRef)

     if(docSnap.exists() ){
      const {quantity} =docSnap.data();
      if(quantity === 1){
        await deleteDoc(docRef);
      }
      else {
        await setDoc(docRef,{quantity:  quantity - 1})
      }
     }
     await updateInventory()
  }
  const handleAuth = async () => {
    if (authMode === 'signin') {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error signing in:", error);
      }
    } else {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error signing up:", error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        updateInventory();
      } else {
        setInventory([]);
        setFilteredInventory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchQuery, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setItemName('');
    setItemQuantity(1);
    setOpen(false);
  };

  if (!started) {
    //get starter 
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        bgcolor="#feb968ff"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        sx={{
          backgroundImage: 'url(/signup.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity:0.9,
        }}
      >
        <Typography variant="h2" color="white">Welcome to Pantry Tracker</Typography>
        <Button variant="contained" onClick={() => setStarted(true)}>
          Get Started
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        sx={{
          backgroundImage: 'url(/pantry.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          }}
      >
         <Box 
          width="400px"
          p={4}
          border="2px solid #ff7900"
          borderRadius={3}
          display="flex"
          bgcolor="#f0f0f0"
          flexDirection="column"
          gap={2}
        
        >
        <Typography variant="h4">{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</Typography>
        <TextField
          variant="outlined"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleAuth}>
          {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Button>
        <Button variant="text" onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}>
          {authMode === 'signin' ? 'Create an account' : 'Already have an account? Sign In'}
        </Button>
      </Box>
      </Box>
    );
  }
  return (
  <Box width="100vw" 
  height="100vh" 
  display="flex" 
  
  flexDirection="column"
  justifyContent="center" 
  alignItems="center" 
  gap={2}
  sx={{
    backgroundImage: 'url(/home.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    }} 
  >
    <Button variant="contained" onClick={handleSignOut}>
        Sign Out
      </Button>
    <Modal open={open} onClose={handleClose}>
      <Box 
      position="absolute" 
      top="50%"
      left="50%" 
      width={400}
      bgcolor="white"
      border="3px solid black"
      boxShadow={25}
      p={4}
      display="flex"
      flexDirection="column"
      gap={3}
      sx={{
        transform: 'translate(-50%,-50%)',
      }}
      >
        <Typography variant="h5">Add Item</Typography>
        <Stack width="100%" direction="row" spacing={2}>
        <TextField 
        variant="outlined"
        fullWidth
        label="Item Name"
        value={itemName}
        onChange={(e)=> {
          setItemName(e.target.value)
        }
        }  
        />
         <TextField 
              variant="outlined"
              fullWidth
              label="Quantity"
              type="number"
              value={itemQuantity}
              onChange={(e)=> {setItemQuantity(Number(e.target.value))}  }
            />
      <Button
      variant="outlined"
      onClick={()=> {
       /* addItem(itemName)
        setItemName('')
        setItemQuantity(1)
        handleClose()*/
        if (itemName && itemQuantity > 0) {
          addItem(itemName, itemQuantity);
          handleClose();
        } else {
          alert("Please enter a valid item name and quantity.");
        }
      }}
      >Add</Button>
      </Stack>
      </Box>
    </Modal>
    <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          onClick={handleOpen}
        >
          Add New Item
        </Button>
        <TextField
          variant="outlined"
          label="Search Items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    <Box border="2px solid #333" borderRadius={3} width="95vw" height="65vh" overflow="auto">
      <Box
      width="100%"
      height="100px"
      bgcolor="#ffdc00"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius={3}
      >
        <Typography variant="h2" color="#333">
          Pantry Items
        </Typography>
      </Box>
    <Stack  direction="row"  padding={2} spacing={2} sx={{ overflowX: 'auto' }}>
    {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              minWidth="200px"
              minHeight="150px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={3}
              border="2px solid #e99494"
              borderRadius={3}
            >
              {imageMap[name.toLowerCase()] && (
  <Image src={imageMap[name.toLowerCase()]} alt={name} width={100} height={100} style={{ border: '2px solid black', borderRadius: '8px' }}/>
)}
          <Typography variant="h4" color="#333" padding={3}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
          </Typography>
          
          <Typography variant="h4" color="#333" padding={2} >
          {quantity}
          </Typography>
          <Stack direction="row" spacing={3}>
          <Button variant="contained" 
          onClick={()=>{
            addItem(name,1)
          }}>
            +
          </Button>

          <Button variant="contained" 
          onClick={()=>
            removeItem(name)
          }>
            -
          </Button>
          </Stack>
        </Box> 
      ))}
    </Stack>
      </Box>
    </Box>
  );
}
