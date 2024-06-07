import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"; // Example using Material Community Icons
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { fetchLocations, fetchWeatherForecast } from "./api/fetch";
import * as Progress from "react-native-progress";
import { getData, storeData } from "./utilis/asyncStorage";

const App = () => {
  const [input, setInput] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [currentWeather, setCurrentWeather] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSearching = (value) => {
    setShowSearch(true);
    setInput(value);
    if (input.length > 2) {
      fetchLocations({ cityName: input }).then((data) => {
        setLocationList(data);
      });
    }
  };

  const handleLocation = (loc) => {
    setInput([]);
    fetchWeatherForecast({
      cityName: loc?.name,
      days: "7",
    }).then((data) => {
      setCurrentWeather(data);
      setLoading(false);
      storeData("city", loc?.name);
    });
    setShowSearch(false);
  };

  const fetchDefaultWeather = async () => {
    try {
      let myCity = await getData("city");
      let cityName = "Lagos";
      if (myCity) cityName = myCity;
      const defaultForecast = await fetchWeatherForecast({
        cityName,
        days: "7",
      });
      setCurrentWeather(defaultForecast);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching default weather:", error);
    }
  };

  useEffect(() => {
    fetchDefaultWeather();
  }, []);

  const toggleShowSearch = () => {
    setShowSearch((prev) => !prev); //This function hides the Search  option box
  };

  const { current, location } = currentWeather;
  return (
    <View style={styles.container}>
      <Image
        blurRadius={70}
        source={require("./assets/images/bg.png")}
        style={styles.bgImage}
      />

      {loading ? (
        <View style={styles.loading}>
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
        <SafeAreaView style={styles.weatherContainer}>
          <View style={styles.searchBox}>
            <View style={styles.searchItems}>
              <TextInput
                value={input}
                onChangeText={handleSearching}
                placeholder={location.name || "Enter your city"}
                placeholderTextColor={"gray"}
                style={styles.searchInput}
              />
              <TouchableOpacity
                style={styles.searchIcon}
                onPress={toggleShowSearch}
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            {showSearch && (
              <View style={styles.optionBox}>
                {locationList.map((loc, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
                    onPress={() => handleLocation(loc)}
                  >
                    <FontAwesome name="map-marker" size={20} color="#808080" />
                    <Text style={styles.optionText}>
                      {loc?.name ? `${loc.name}, ` : ""}
                      {loc?.country ? loc.country : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.weatherInfo}>
            <Text style={styles.location}>
              {location?.name},
              <Text style={styles.country}> {location?.country}</Text>
            </Text>
            <Image
              source={{ uri: "https:" + current?.condition.icon }}
              style={styles.descImage}
            />
            <Text style={styles.degText}>{current.temp_c}&#176;</Text>
            <Text style={styles.descText}>{current.condition.text}&#176;</Text>

            <View style={styles.moreInfo}>
              <View style={styles.moreInfoItems}>
                <Image
                  source={require("./assets/icons/wind.png")}
                  style={styles.moreInfoImage}
                />
                <Text style={styles.moreInfoItemsText}>
                  {current.wind_kph}km
                </Text>
              </View>
              <View style={styles.moreInfoItems}>
                <Image
                  source={require("./assets/icons/drop.png")}
                  style={styles.moreInfoImage}
                />
                <Text style={styles.moreInfoItemsText}>
                  {current?.humidity}
                </Text>
              </View>
              <View style={styles.moreInfoItems}>
                <Image
                  source={require("./assets/icons/sun.png")}
                  style={styles.moreInfoImage}
                />
                <Text style={styles.moreInfoItemsText}>
                  {currentWeather?.forecast?.forecastday[0]?.astro?.sunrise ||
                    "6:30pm"}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center", // Centers the content horizontally
  },
  bgImage: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },

  //Styles for the weather Components
  weatherContainer: {
    display: "flex",
    marginTop: 100,
    alignItems: "center",
    marginHorizontal: 10,
  },
  searchBox: {
    position: "relative",
    alignItems: "center",
    zIndex: 50,
  },
  searchIcon: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255,0.4)",
    borderRadius: "25px",
    padding: 5,
  },
  searchItems: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255,0.2)",
    borderRadius: "25px",
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 50,
    width: "90%",
    borderRadius: 15,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  optionBox: {
    width: "95%",
    height: "50vh",
    borderRadius: "20px",
    zIndex: 10,
    position: "absolute",
    marginTop: 60,
    padding: 20,
    backgroundColor: "white",
  },
  optionItem: {
    flexDirection: "row",
    borderBottomWidth: 0.2,
    borderColor: "black",
    width: "100%",
    gap: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  optionText: {
    fontSize: 16,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  weatherInfo: {
    alignItems: "center",
    marginTop: 100,
    zIndex: 1,
  },
  location: {
    fontSize: 25,
    color: "white",
    fontWeight: "700",
    paddingVertical: 50,
  },
  country: {
    fontSize: 19,
    color: "#808080",
  },
  descImage: {
    width: 100,
    height: 100,
  },
  degText: {
    fontSize: 50,
    marginTop: 45,
    color: "white",
    fontWeight: "700",
  },
  descText: {
    fontSize: 20,
    marginTop: 45,
    color: "white",
    fontWeight: "600",
  },
  moreInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    marginTop: 30,
  },
  moreInfoItems: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    color: "white",
  },
  moreInfoItemsText: {
    color: "white",
  },

  moreInfoImage: {
    width: 30,
    height: 30,
  },
  loading: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
});

export default App;
