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
//----------------------------------------------------

//Global Variable
//  ID

//  LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);
//  Wi-Fi
const char *ssid = "KornDva";
const char *password = "Kornasak39";
//  MQTT
const char *mqtt_server = "broker.mqttdashboard.com";
WiFiClient espClient;
PubSubClient client(espClient);
char outTopic[] = "myTopic";
int number = 0;
//  Water Flow Sensor
volatile int NbTopsFan; //measuring the rising edges of the signal
float Calc;
float Total;
int intTotal;
int hallsensor = 14;   //The pin location of the sensor
// IR Receiver
const uint16_t kRecvPin = 0;   // ir is connected to pin 0
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
struct backup_data {
  String b_roomID;
  int b_electunit;
  float b_waterunit;
} backup_data;
//  otherwise
int delayTime = 1;
//----------------------------------------------------

// Custom Character LCD
byte nowCols[8] = {
  B11111,
  B11111,
  B11111,
  B11111,
  B11111,
  B11111,
  B11111,
  B11111
};
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
  if (WiFi.status() != WL_CONNECTED)
  {
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
  if (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    char clientID[15];
    String("iot-" + String(random(1000000))).toCharArray(clientID, 15);
    //Random Client ID
    if (client.connect(clientID))
    {
      Serial.println("Successfully connected with MQTT");
      Serial.print("Client: ");
      Serial.println(clientID);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds"); // Wait 5 seconds before retrying delay(1000);
    }
  }
}


void rpm () {
  //This is the function that the interupt calls
  NbTopsFan++; //This function measures the rising and falling edge of the hall effect sensors signal
}


//----------------------------------------------------

//Main
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
  //LCD
  Wire.begin(D2, D1);
  lcd.begin();
  lcd.print("Electric: 0");
  lcd.setCursor(0, 1);
  lcd.print("Water: 0");
  lcd.setCursor(10, 0);
  lcd.home();
  // IR Receiver
  irrecv.enableIRIn();
  // create a new custom character
  lcd.createChar(0, nowCols);
  // EEPROM (512 bytes)
  EEPROM.begin(512);
  EEPROM.get(eeAddress, backup_data);
  roomID = backup_data.b_roomID;
  number = backup_data.b_electunit;
  Total = backup_data.b_waterunit;
  Serial.println("Load Back up from EEPROM");
  Serial.print("This Room ID : ");
  Serial.println(backup_data.b_roomID);
  Serial.print("This Room Elect Units : ");
  Serial.println(backup_data.b_electunit);
  Serial.print("This Room Water Units : ");
  Serial.println(backup_data.b_waterunit);
  EEPROM.put(eeAddress, backup_data);
}

void waterCount() {
  NbTopsFan = 0;     //Set NbTops to 0 ready for calculations
  sei();           //Enables interrupts
  delay (1000);     //Wait 1 second
  cli();           //Disable interrupts
  Calc = (NbTopsFan * 60 / 7.5) / 3600; //(Pulse frequency x 60) / 7.5Q, = flow rate in L/hour
  Total += Calc;
  intTotal = Total;
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
    Serial.print("Now Room ID : ");
    Serial.println(roomID);
    Serial.print("Now numCols : ");
    Serial.println(numCols);
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
          //          if (numCols > 2) {
          //            numCols = 2;
          //          }
        }
        switch (results.value) {
          //        case 0xFFE01F:
          //          numCols -= 1;
          //          roomID.remove(numCols, numCols);
          //          break ;
          case 0xFFA857:
            saveRoomID = 1;
            break ;
          case 0xFFB04F:
            lcd.print("*");
            roomID.remove(numCols);
            numCols -= 1;
            if (numCols < 0) {
              roomID = "";
              numCols = 0;
            }
            break ;
          //        case 0xFF906F:
          //          numCols += 1;
          //          break ;
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
      }
      key_value = results.value;
      irrecv.resume();
    }
    delay(100);
  }
  backup_data.b_roomID = roomID;
  Serial.print("This Room ID : ");
  Serial.println(backup_data.b_roomID);
}

void irRemote() {
  while (irrecv.decode(&results)) {
    Serial.println("IR Start");
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
//    EEPROM.end();
  }
  roomID = "";
  number = 0;
  Total = 0;
}

void loop() {
  // put your main code here, to run repeatedly:
  if (!client.connected())
  {
    reconnect();
  }
  if (roomID == "") {
    setRoomID();
    lcd.clear();
  } else {
    irRemote();
  }
  waterCount();
  Serial.print ("Total: "); //Prints the number calculated above
  Serial.println (Total, 4); //Prints the number calculated above
  Serial.print ("Calc: "); //Prints the number calculated above
  Serial.println (Calc, 4); //Prints the number calculated above
  lcd.print("Electric: 0");
  lcd.setCursor(0, 1);
  lcd.print("Water: 0");
  lcd.setCursor(10, 0);
  lcd.print(number);
  lcd.setCursor(7, 1);
  lcd.print(Total, 4);
  lcd.setCursor(0, 0);
  Serial.println(delayTime);
  if (delayTime == 5) {
    if (roomID != "") {
      backup_data.b_electunit = number;
      backup_data.b_waterunit = Total;
      Serial.print("This Room ID : ");
      Serial.println(backup_data.b_roomID);
      Serial.print("This Room Elect Units : ");
      Serial.println(backup_data.b_electunit);
      Serial.print("This Room Water Units : ");
      Serial.println(backup_data.b_waterunit);
      EEPROM.put(eeAddress, backup_data);
      EEPROM.commit();
      char outPayload[1000] = "";
      sprintf(outPayload, "{\"room\": \"%i\", \"elec_usage\": %i, \"water_usage\" : %d.%04d}", roomID.toInt(), number, (int)Total, (int)(Total * 10000) % 10000);
      Serial.println(outPayload);
      client.publish(outTopic, outPayload);
    }
    delayTime = 0;
  }
  delayTime++;
  client.loop();
  number++;
}
