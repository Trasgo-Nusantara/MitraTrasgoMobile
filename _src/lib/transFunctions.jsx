import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLocale } from "./translations";

const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('languange')
      if (value !== null) {
        setLocale(value)
        return value
      }else{
        await AsyncStorage.setItem('languange','id')
        setLocale('id')
        return 'id'
      }
    } catch (e) {
      await AsyncStorage.setItem('languange','id')
      setLocale('id')
      return 'id'
    }
  };

  export {
    getData
  }