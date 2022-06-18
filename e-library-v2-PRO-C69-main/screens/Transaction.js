import React, { Component } from "react";
import { 
  View,
   Text, 
   StyleSheet, 
   TouchableOpacity,
   TextInput, 
   Image, 
   ImageBackground,
   Alert,
  ToastAndroid,
  KeyboardAvoidingView

  } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../config";
import firebase from 'firebase';

const bgImage = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require ("../assets/appName.png");

export default class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId:"",
      studentId: "",
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false,
      bookName:"",
      studentName:""
    };
  }

  getCameraPermissions = async domState => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
      hasCameraPermissions: status === "granted",
      domState: domState,
      scanned: false
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    const {domState} = this.state;

    if (domState === "bookId"){
    this.setState({
      scannedData: data,
      domState: "normal",
      scanned: true
    });
} else if (domState === "studentId"){
  this.setState({
    scannedData: data,
    domState: "normal",
    scanned: true
});
}
  };
  handleTransaction = async () => {
    var { bookId } = this.state;
    await this.getstudentDetails(studentId);
    await this.getbookDetails(bookId);

    db.collection('books')
    .doc(bookId)
    .get()
    .then(doc => {
      var book = doc.data();
      if (book.is_book_available) {
        var {bookName, studentName }= this.state;
        this.initiateBookIssue(bookId, studentId, bookName, studentName);

        ToastAndroid.show("Book issued to the student!", ToastAndroid.SHORT);

      } else {
        var {bookName, studentName }= this.state;
        this.initiateBookReturn(bookId, studentId, bookName, studentName);

        ToastAndroid.show(
          "Book returned to the library!",
          ToastAndroid.SHORT
        );
      }
    });
  };

  getBookDetails = bookId => {
    bookId = bookId.trim( );
    db.collection("books")
    .where("book_id", "==", bookId)
    .get()
    .then(snapshot => {
    snapshot.docs.map(doc => {
    this.setState({
    bookName: doc.data().book_details.book_name
      });
   });
 });
};

getStudentDetails = studentId => {
  studentId = studentId.trim( );
  db.collection("students")
  .where("student_id", "==", studentId)
  .get()
  .then(snapshot => {
  snapshot.docs.map(doc => {
  this.setState({
  studentName: doc.data().student_details.student_name
    });
 });
});
};

  initiateBookIssue = (bookId, studentId, bookName, studentName) => {
    db.collection("transactions").add({
      
    })
  };

  initiateBookReturn = () => {
    console.log('Book returned to library!');
  };

  render() {
    const { domState, hasCameraPermissions, scannedData, scanned } = this.state;
    if (domState === "scanner") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {hasCameraPermissions ? scannedData : "Request for Camera Permission"}
        </Text>
        <TouchableOpacity
          style={[styles.button, { marginTop: 25 }]}
          onPress={() => this.getCameraPermissions("scanner")}
        >
          <Text style={styles.buttonText}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5653D4"
  },
  text: {
    color: "#ffff",
    fontSize: 15
  },
  button: {
    width: "43%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderRadius: 15
  },
  buttonText: {
    fontSize: 24,
    color: "#FFFFFF"
  }
});
