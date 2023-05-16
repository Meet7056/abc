import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';

import { BackHandler } from 'react-native';

const API_URL =
  'https://cms-sparrow.herokuapp.com/parts/machinetype_wise_all_parts';
const App = ({ navigation, route }) => {
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  // get all data from start complaint screen of item

  const cmp_id = route.params.dataFromRouteFromTodayScreen.cmp_id;
  const partyName = route.params.dataFromRouteFromTodayScreen.partyName;
  const machineType = route.params.dataFromRouteFromTodayScreen.machineType;
  const partyCity = route.params.dataFromRouteFromTodayScreen.partyCity;
  const machineNumber = route.params.dataFromRouteFromTodayScreen.machineNo;

  useEffect(() => {
    axios
      .post(API_URL, {
        machineType: '4P Machine',
      })
      .then((response) => {
        setItems(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSelectItem = (itemId) => {
    const isSelected = selectedItems.includes(itemId);
    setSelectedItems((prevSelectedItems) =>
      isSelected
        ? prevSelectedItems.filter((id) => id !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

  const renderItem = ({ item }) => {
    const handleQuantityChange = (itemId, quantity) => {
      // check if the new quantity is within the limit
      quantity = Math.min(Math.max(quantity, 0), item.partsQuantity);

      setQuantities((prevQuantities) => {
        const newQuantities = { ...prevQuantities };
        newQuantities[itemId] = quantity;
        return newQuantities;
      });
    };
    const itemId = item.partsName;
    const quantity = quantities[itemId] || 0;
    const isSelected = selectedItems.includes(itemId);

    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={() => handleSelectItem(itemId)}>
          {isSelected ? (
            <Image
              source={require('../icons/checkboxIcon.png')}
              style={styles.icon}
            />
          ) : (
            <Image
              source={require('../icons/checkboxoutlineIcon.png')}
              style={styles.icon}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.title}>{item.partsName}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => handleQuantityChange(itemId, quantity - 1)}>
            <Image
              source={require('../icons/minusIcon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => handleQuantityChange(itemId, quantity + 1)}>
            <Image
              source={require('../icons/addIcon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const [checkOutResponse, setcheckOutResponse] = useState(true);

  const handleSubmit = () => {

    // Send the selected items and quantities to the server
    const selectedItemsDetails = items.filter((item) =>
      selectedItems.includes(item.partsName)
    );
    const selectedQuantities = selectedItemsDetails.map((item) => ({
      partsName: item.partsName[0],
      partsQty: quantities[item.partsName],
      partsPrice: item.partsPrice,
    }));
    // make your API request with the selected items and quantities
    const dataToSendToMainAPI = {
      cmp_id,
      partyName,
      machineType,
      partyCity,
      machineNumber,
      partsDetails: selectedQuantities,
      isAdmin: true,
    };
    console.log(selectedQuantities)
    axios
      .post(
        'https://cms-sparrow.herokuapp.com/parts/show_billing_data',
        dataToSendToMainAPI
      )
      .then((response) => {
        console.log(response.data.statusCode)
        if (response.data.statusCode == 200) {
          Alert.alert('Parts Added!');
          navigation.goBack();
          axios.post(
            'https://cms-sparrow.herokuapp.com/parts/checkout/',
            dataToSendToMainAPI
          );
        } else {
          const handleConfirmation = () => {
            // handle confirmation logic here
            Alert.alert('Parts Added!');
            navigation.goBack();
            axios.post(
              'https://cms-sparrow.herokuapp.com/parts/checkout/',
              dataToSendToMainAPI
            );
          };

          const handleCancellation = () => {
            Alert.alert('Parts not Added!');
            navigation.goBack();
          };

          Alert.alert(
            'Your Machine Warranty has been Expire',
            'Are you sure you want to Add parts?',
            [
              {
                text: 'Cancel',
                onPress: handleCancellation,
                style: 'cancel',
              },
              {
                text: 'Confirm',
                onPress: handleConfirmation,
              },
            ],
            { cancelable: false }
          );
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Parts!</Text>
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.partsName}
      />
      <Button onPress={handleSubmit} title={'Add Parts Now!'} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    margin: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontWeight: 'bold',
    padding: 7,
  },
  icon: {
    height: 20,
    width: 20
  },
  header:{
    marginBottom:20,
    marginTop:-5
  },
  headerText:{
    fontWeight:"bold",
    fontSize:25
  }
});

export default App;
