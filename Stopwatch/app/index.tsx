import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

export default function App() {
  const [time, Time] = useState(0);
  const [isRunning, Running] = useState(false);
  const [laps, Lap] = useState<number[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRunning) {
      timer = setInterval(() => {
        Time((prev) => prev + 1);
      }, 10);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  const startPauseHandler = () => Running(!isRunning);
  const stopHandler = () => {
    Running(false);
  };

  const lapHandler = () => isRunning && Lap([...laps, time]);
  const clearLapsHandler = () => Lap([]);
  
  const clearStopwatchHandler = () => {
    Running(false);
    Time(0);
    Lap([]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 6000);
    const seconds = Math.floor((ms % 6000) / 100);
    const milliseconds = ms % 100;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}.${milliseconds < 10 ? "0" : ""}${milliseconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(time)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startPauseHandler}>
          <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stopHandler}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={lapHandler} disabled={!isRunning}>
          <Text style={styles.buttonText}>Lap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clearLapsHandler}>
          <Text style={styles.buttonText}>Clear Laps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clearStopwatchHandler}>
          <Text style={styles.buttonText}>Clear Stopwatch</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={laps}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => <Text style={styles.lapText}>Lap {index + 1}: {formatTime(item)}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: height * 0.05, // Adjust top padding based on screen height
  },
  timer: {
    fontSize: width * 0.1, // Adjust font size based on screen width
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
    maxWidth: width * 0.9, // Limit max width of button container
  },
  button: {
    backgroundColor: "#6200ea",
    padding: width * 0.05, // Adjust button padding based on screen width
    margin: width * 0.02, // Adjust margin between buttons
    borderRadius: 10,
    width: width * 0.4, // Adjust button width based on screen width
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.04, // Scale button text size
    textAlign: "center",
  },
  lapText: {
    fontSize: width * 0.05, // Scale lap text size
    marginTop: 5,
  },
});
