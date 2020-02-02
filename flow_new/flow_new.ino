// reading liquid flow rate using Seeeduino and Water Flow Sensor from Seeedstudio.com

// Code adapted by Charles Gantt from PC Fan RPM code written by Crenn @thebestcasescenario.com

// http:/themakersworkbench.com http://thebestcasescenario.com http://seeedstudio.com
#include <LiquidCrystal_I2C.h>
#include <ESP8266WiFi.h>
#include <Wire.h>
#include <stdio.h>
const char *ssid = "($this)iPhone";
const char *password = "12345678";
LiquidCrystal_I2C lcd(0x27, 16, 2);

volatile int NbTopsFan; //measuring the rising edges of the signal

int Calc;

float Calc_sec;
float total = 0;
float units = 0;

const byte switchPin = 2;              // switch is connected to pin 2
byte buttonPresses = 0;                // how many times the button has been pressed
byte lastPressCount = 0;

int hallsensor = 14;   //The pin location of the sensor

void setup_wifi()
{
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
}

//void reconnect()
//{
//  // Loop until we're reconnected
//  while (!client.connected())
//  {
//    Serial.print("Attempting MQTT connection...");
//    char clientID[15];
//    String("iot-" + String(random(1000000))).toCharArray(clientID, 15);
//    //Random Client ID
//    if (client.connect(clientID))
//    {
//      Serial.println("Successfully connected with MQTT");
//      Serial.print("Client: ");
//      Serial.println(clientID);
//    }
//    else
//    {
//      Serial.print("failed, rc=");
//      Serial.print(client.state());
//      Serial.println(" try again in 5 seconds"); // Wait 5 seconds before retrying delay(1000);
//    }
//  }
//}

void rpm () {
  //This is the function that the interupt calls
  NbTopsFan++; //This function measures the rising and falling edge of the hall effect sensors signal
}

void elecCount() {
  lastPressCount++;
}

void waterCount() {
  NbTopsFan = 0;     //Set NbTops to 0 ready for calculations
  sei();           //Enables interrupts
  delay (1000);     //Wait 1 second
  cli();           //Disable interrupts
  Calc = (NbTopsFan * 60 / 7.5); //(Pulse frequency x 60) / 7.5Q, = flow rate in L/hour
  Calc_sec = (NbTopsFan * 60 / 7.5) / 3600; //(Pulse frequency x 60) / 7.5Q, = flow rate in L/sec
  total = total + Calc_sec;
}

void setup() {
  // The setup() method runs once, when the sketch starts
  pinMode(hallsensor, INPUT); //initializes digital pin 2 as an input
  Serial.begin(9600); //This is the setup function where the serial port is initialised,
  
  attachInterrupt(14, rpm, RISING); //and the interrupt is attached
  Wire.begin(D2, D1);
  lcd.begin();
  lcd.home();
  lcd.print("Electric: 0.0000");
  lcd.setCursor(0, 1);
  lcd.print("Water: 000000000");
  lcd.setCursor(0, 0);
  pinMode(switchPin, INPUT);
  digitalWrite(switchPin, HIGH);      // set pullup resistor

}

void loop () {
  setup_wifi();
  waterCount();
  

  if (digitalRead(switchPin) == LOW)  // check if button was pressed
  {
    buttonPresses++;
    elecCount();
  }
  if (buttonPresses == 4) buttonPresses = 0;         // rollover every fourth press
  //  if (lastPressCount != buttonPresses)              // only do output if the count has changed
  //  {
  //    Serial.print ("Button press count = ");          // out to serial
  //    Serial.println(buttonPresses, DEC);
  //    lastPressCount = buttonPresses;    // track last press count
  //  }

  Serial.print (Calc, DEC); //Prints the number calculated above
  Serial.print (" L/hour\r\n"); //Prints "L/hour" and returns a new line

  Serial.print (Calc_sec, 4); //Prints the number calculated above
  Serial.print (" L/sec\r\n");

  Serial.print ("Total Water: ");
  Serial.print (total, 3); //Prints the number calculated above
  Serial.print (" Units\r\n");
  Serial.print ("Total Elec: ");
  Serial.print (lastPressCount, 4); //Prints the number calculated above
  Serial.print (" Units\r\n");

  Serial.print (" ------------------------------------------------------\r\n");
  lcd.setCursor(10, 0);
  lcd.print(lastPressCount, 4);

  lcd.setCursor(7, 1);
  lcd.print(total, 4);

}
