//Import Library
#ifndef UNIT_TEST
#include <Arduino.h>
#endif
#include <IRremoteESP8266.h>
#include <IRrecv.h>
#include <IRutils.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <EEPROM.h>
#include <SoftwareSerial.h>
#include <PZEM004T.h>
//----------------------------------------------------
//Global Variable
//  LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);
//  Wi-Fi
const char *ssid = "KornDva";
const char *password = "Kornasak39";
//  MQTT
const char *mqtt_server = "broker.mqttdashboard.com";
WiFiClient espClient;
PubSubClient client(espClient);
char usedTopic[] = "myTopic";
// PZEM004T Sensor
PZEM004T pzem(3, 1); // (RX,TX) connect to D6,D7 of PZEM
IPAddress ip(192, 168, 1, 1);
float current_elec;
float elec_Total;
float elec_Units;
//  Water Flow Sensor
volatile int NbTopsFan; //measuring the rising edges of the signal
float current_water;
float water_Total;
float water_Units;
int hallsensor = 14;   //Flow sensor is connected to pin D5
// IR Receiver
const uint16_t kRecvPin = 0;   // ir is connected to pin D3
IRrecv irrecv(kRecvPin);
decode_results results;
unsigned long key_value = 0;
int numCols = 0;
const String checkpass = "1234";
String pass = "";
int saveRoomID = 0;
String roomID = "";
// EEPROM data
int eeAddress = 0;
struct backupData {
  char b_roomID[3];
  int b_elec;
  float b_water;
} backupData;
//  otherwise
int delayTime = 1;
int relayPort = 0; // Relay is connected to pin RX
//----------------------------------------------------
//Function
//  Connect to Wi-Fi
void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  if (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

//  Connect to MQTT
void reconnect() {
  // Loop until we're reconnected
  if (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    char clientID[15];
    String("iot-" + String(random(1000000))).toCharArray(clientID, 15);
    //Random Client ID
    if (client.connect(clientID)) {
      Serial.println("Successfully connected with MQTT");
      Serial.print("Client: ");
      Serial.println(clientID);
      client.subscribe(usedTopic);
    }
    else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds"); // Wait 5 seconds before retrying delay(1000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String text = "";
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    text += (char)payload[i];
  }

  if (text == "ON") {
    Serial.println("ON");
    digitalWrite (relayPort, HIGH);
    // but actually the LED is on; this is because
    // it is active low on the ESP-01)
  } else if (text == "OFF") {
    Serial.println("OFF");
    digitalWrite (relayPort, LOW);
  } else if (text == "CLEAREEPROM") {
    Serial.println("CLEAREEPROM");
    clearEEPROM();
  }

}

void rpm () {
  //This is the function that the interupt calls
  NbTopsFan++; //This function measures the rising and falling edge of the hall effect sensors signal
}

//----------------------------------------------------
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  //Flow Sensor
  pinMode(hallsensor, INPUT); //initializes digital pin 2 as an input
  attachInterrupt(14, rpm, RISING); //and the interrupt is attached
  //Wi-Fi
  setup_wifi();
  //MQTT
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  //LCD
  Wire.begin(D2, D1); //d2 = sda , d1 = scl
  lcd.begin();
  lcd.print("Electric: 0");
  lcd.setCursor(0, 1);
  lcd.print("Water: 0");
  lcd.setCursor(10, 0);
  lcd.home();
  // IR Receiver
  irrecv.enableIRIn();
  // Relay
  pinMode(relayPort, OUTPUT);
  digitalWrite (relayPort, HIGH); // Set starting off relay sensor
  // EEPROM (512 bytes)
  EEPROM.begin(512);
  EEPROM.get(eeAddress, backupData);
  roomID = backupData.b_roomID;
  elec_Total = backupData.b_elec;
  water_Total = backupData.b_water;
  Serial.println("Load Back up from EEPROM");
  Serial.print("This Room ID : ");
  Serial.println(backupData.b_roomID);
  Serial.print("This Room Elect Units : ");
  Serial.println(backupData.b_elec);
  Serial.print("This Room Water Units : ");
  Serial.println(backupData.b_water);
  Serial.println ("----------------------------------------------------");
}

void waterCount() {
  NbTopsFan = 0;     //Set NbTops to 0 ready for calculations
  sei();           //Enables interrupts
  delay (1000);     //Wait 1 second
  cli();           //Disable interrupts
  current_water = (NbTopsFan * 60 / 7.5) / 3600; //(Pulse frequency x 60) / 7.5Q, = flow rate in L/sec
  water_Total += current_water;
  water_Units = water_Total / 1000; // Convert L/sec to M^3/h
}

void elecCount() {
  Serial.println(pzem.current(ip));
  current_elec = pzem.current(ip) / 3600;
  elec_Total += current_elec;
  elec_Units += elec_Total / 1000; // Convert W/sec to W/h
}

void enterPass() {
  pass = "";
  numCols = 0;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Enter Password");
  lcd.setCursor(0, 1);
  lcd.print("****");
  while (numCols < 4) {
    lcd.setCursor(numCols, 1);
    while (irrecv.decode(&results)) {
      // print() & println() can't handle printing long longs. (uint64_t)
      if (results.value == 0xFFFFFFFF) {
        results.value = key_value;
      }
      switch (results.value) {
        case 0xFF6897:
          lcd.print("0");
          pass += "0";
          numCols += 1;
          break ;
        case 0xFF30CF:
          lcd.print("1");
          pass += "1";
          numCols += 1;
          break ;
        case 0xFF18E7:
          lcd.print("2");
          pass += "2";
          numCols += 1;
          break ;
        case 0xFF7A85:
          lcd.print("3");
          pass += "3";
          numCols += 1;
          break ;
        case 0xFF10EF:
          lcd.print("4");
          pass += "4";
          numCols += 1;
          break ;
        case 0xFF38C7:
          lcd.print("5");
          pass += "5";
          numCols += 1;
          break ;
        case 0xFF5AA5:
          lcd.print("6");
          pass += "6";
          numCols += 1;
          break ;
        case 0xFF42BD:
          lcd.print("7");
          pass += "7";
          numCols += 1;
          break ;
        case 0xFF4AB5:
          lcd.print("8");
          pass += "8";
          numCols += 1;
          break ;
        case 0xFF52AD:
          lcd.print("9");
          pass += "9";
          numCols += 1;
          break ;
      }
      key_value = results.value;
      irrecv.resume();
    }
    delay(100);
  }
}

void checkPass() {
  while (pass != checkpass) {
    enterPass();
  }
}

void setRoomID() {
  roomID = "";
  numCols = 0;
  saveRoomID = 0;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Enter Room ID");
  lcd.setCursor(0, 1);
  lcd.print("***");
  while (saveRoomID != 1) {
    lcd.setCursor(numCols, 1);
    while (irrecv.decode(&results)) {
      // print() & println() can't handle printing long longs. (uint64_t)
      if (numCols > 2) {
        roomID.remove(3);
        numCols = 2;
        lcd.setCursor(2, 1);
      } else {
        if (results.value == 0xFFFFFFFF) {
          results.value = key_value;
        }
        switch (results.value) {
          case 0xFFA857:
            saveRoomID = 1;
            break ;
          case 0xFFB04F:
            roomID.remove(numCols);
            numCols -= 1;
            lcd.print("*");
            lcd.setCursor(numCols, 1);
            if (numCols < 0) {
              roomID = "";
              numCols = 0;
            }
            break ;
          case 0xFF6897:
            roomID += "0";
            lcd.print("0");
            numCols += 1;
            break ;
          case 0xFF30CF:
            roomID += "1";
            lcd.print("1");
            numCols += 1;
            break ;
          case 0xFF18E7:
            roomID += "2";
            lcd.print("2");
            numCols += 1;
            break ;
          case 0xFF7A85:
            roomID += "3";
            lcd.print("3");
            numCols += 1;
            break ;
          case 0xFF10EF:
            roomID += "4";
            lcd.print("4");
            numCols += 1;
            break ;
          case 0xFF38C7:
            roomID += "5";
            lcd.print("5");
            numCols += 1;
            break ;
          case 0xFF5AA5:
            roomID += "6";
            lcd.print("6");
            numCols += 1;
            break ;
          case 0xFF42BD:
            roomID += "7";
            lcd.print("7");
            numCols += 1;
            break ;
          case 0xFF4AB5:
            roomID += "8";
            lcd.print("8");
            numCols += 1;
            break ;
          case 0xFF52AD:
            roomID += "9";
            lcd.print("9");
            numCols += 1;
            break ;
        }
        Serial.print("Now Room ID : ");
        Serial.println(roomID);
        Serial.print("Now numCols : ");
        Serial.println(numCols);
      }
      key_value = results.value;
      irrecv.resume();
    }
    delay(100);
  }
  strcpy(backupData.b_roomID, roomID.c_str());
  Serial.print("This Room ID : ");
  Serial.println(backupData.b_roomID);
  Serial.println ("----------------------------------------------------");
}

void irRemote() {
  while (irrecv.decode(&results)) {
    // print() & println() can't handle printing long longs. (uint64_t)
    if (results.value == 0xFFFFFFFFFFFFFFFF) {
      results.value = key_value;
    }

    switch (results.value) {
      case 0xFFE21D:
        Serial.println("MENU");
        enterPass();
        checkPass();
        setRoomID();
        lcd.clear();
        break;
      case 0xFF22DD:
        Serial.print("This room ID is : ");
        Serial.println(roomID);
        Serial.println ("----------------------------------------------------");
        break;
      case 0xFFA25D:
        clearEEPROM();
        break;
    }
    key_value = results.value;
    irrecv.resume();
  }
  delay(100);
}

void clearEEPROM() {
  for (int i = 0 ; i < 512 ; i++) {
    EEPROM.write(i, 0);
    EEPROM.commit();
  }
  Serial.println("Cleared!!!");
  Serial.println ("----------------------------------------------------");
  roomID = "";
  elec_Total = 0;
  water_Total = 0;
  strcpy(backupData.b_roomID, roomID.c_str());
  backupData.b_elec = elec_Total;
  backupData.b_water = water_Total;
  EEPROM.put(0, backupData);
  EEPROM.commit();
}

void relayControl() {
  Serial.print("");
  digitalWrite (relayPort, LOW);
}

void loop() {
  // put your main code here, to run repeatedly:
  lcd.print("Electric: 0");
  lcd.setCursor(0, 1);
  lcd.print("Water: 0");
  lcd.setCursor(10, 0);
  lcd.print(elec_Total, 4);
  lcd.setCursor(7, 1);
  lcd.print(water_Total, 4);
  lcd.setCursor(0, 0);
  if (!client.connected())
  {
    reconnect();
  }
  if (roomID == "") {
    //    setRoomID();
    roomID = "101";
    lcd.clear();
  } else {
    irRemote();
  }
  waterCount();
  elecCount();
  Serial.println ("----------------------------------------------------");
  Serial.print ("Calc Elect Units : "); //Prints the number calculated above
  Serial.println (current_elec, 4); //Prints the number calculated above
  Serial.print ("Total Elect Units : "); //Prints the number calculated above
  Serial.println (elec_Total, 4); //Prints the number calculated above
  Serial.print ("Calc Water Units : "); //Prints the number calculated above
  Serial.println (current_water, 4); //Prints the number calculated above
  Serial.print ("Total Water Units : "); //Prints the number calculated above
  Serial.println (water_Total, 4); //Prints the number calculated above
  Serial.println(delayTime);
  backupData.b_elec = elec_Total;
  backupData.b_water = water_Total;
  EEPROM.put(0, backupData);
  EEPROM.commit();
  if (delayTime == 5) {
    if (roomID != "") {
      Serial.println ("----------------------------------------------------");
      Serial.print("This Room ID : ");
      Serial.println(backupData.b_roomID);
      Serial.print("This Room Elect Units : ");
      Serial.println(backupData.b_elec);
      Serial.print("This Room Water Units : ");
      Serial.println(backupData.b_water);
      char outPayload[1000] = "";
      sprintf(outPayload, "{\"room\": \"%i\", \"elec_units\": %d.%04d, \"water_units\" : %d.%04d,  \"elec_usage\": %d.%04d, \"water_usage\" : %d.%04d}", roomID.toInt(), (int)elec_Total, (int)(elec_Total * 10000) % 10000, (int)water_Total, (int)(water_Total * 10000) % 10000, (int)current_elec, (int)(current_elec * 10000) % 10000, (int)current_water, (int)(current_water * 10000));
      Serial.print("Data was put to database : ");
      Serial.println(outPayload);
      client.publish("myTopic", outPayload);
    }
    delayTime = 0;
  }
  delayTime++;
  client.loop();
  Serial.println ("----------------------------------------------------");
}
