import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import SvgIcon from "./SvgIcon";

export default function Input({
  placeholder,
  type,
  keyboardType,
  value,
  onChangeText,
  multiline = false,
  style = {},
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999999"
        style={[styles.input, multiline && styles.multilineInput]}
        keyboardType={keyboardType}
        secureTextEntry={type === "password" && !isPasswordVisible}
        value={value}
        maxLength={30}
        onChangeText={onChangeText}
        multiline={multiline}
      />

      {type === "password" && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <SvgIcon 
            nombre={isPasswordVisible ? "eye-open" : "eye-close"}
            width={20}
            height={20}
            color="#666666"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f542",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: "#0f0c0c",
    paddingVertical: 12,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  iconContainer: {
    paddingLeft: 10,
  },
});