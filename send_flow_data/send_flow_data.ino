//Import Library
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
//----------------------------------------------------

//Global Variable
//  ID

//  LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);
//  Wi-Fi
const char *ssid = "($this)iPhone";
const char *password = "12345678";
//  MQTT
const char *mqtt_server = "broker.mqttdashboard.com";
WiFiClient espClient;
PubSubClient client(espClient);
char outTopic[] = "myTopic";
int number = 1;
int room = 112;
//  Water Flow Sensor
volatile int NbTopsFan; //measuring the rising edges of the signal
float Calc;
float Total;
int intTotal;
int hallsensor = 14;   //The pin location of the sensor
//  otherwise
int delayTime = 1;
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
  lcd.home();
  lcd.print("Electric: 0");
  lcd.setCursor(0, 1);
  lcd.print("Water: 0");
  lcd.setCursor(0, 0);
}

void loop() {
  // put your main code here, to run repeatedly:
  if (!client.connected())
  {
    reconnect();
  }
  NbTopsFan = 0;     //Set NbTops to 0 ready for calculations
  sei();           //Enables interrupts
  delay (1000);     //Wait 1 second
  cli();           //Disable interrupts
  Calc = (NbTopsFan * 60 / 7.5) / 3600; //(Pulse frequency x 60) / 7.5Q, = flow rate in L/hour
  Total += Calc;
  intTotal = Total;
  Serial.print ("Total: "); //Prints the number calculated above
  Serial.println (Total, 4); //Prints the number calculated above
  Serial.print ("Calc: "); //Prints the number calculated above
  Serial.println (Calc, 4); //Prints the number calculated above
  lcd.setCursor(10, 0);
  lcd.print(number);
  lcd.setCursor(7, 1);
  lcd.print(Total, 4);
  if(delayTime == 5){
    char outPayload[1000] = "";
    sprintf(outPayload, "{\"room\": \"%i\", \"elec_usage\": %i, \"water_usage\" : %d.%04d}", room, number, (int)Total, (int)(Total*10000)%10000);
    Serial.print(outPayload);
    client.publish(outTopic, outPayload);
    delayTime = 0;
  }
  delayTime++;
  client.loop();
  number++;
}
