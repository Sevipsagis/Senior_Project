// Include Library
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <stdio.h>
#include <stdlib.h>
// Wi-Fi Setup
const char *ssid = "($this)iPhone";
const char *password = "12345678";
// MQTT Setup
const char *mqtt_server = "broker.mqttdashboard.com";
long lastMsg = 0;
int i;
String msg;
int room = 112;
char outTopic[] = "myTopic";
char inTopic[] = "input-Node-MCU";
char buffer_str[1000];
int number = 1;

LiquidCrystal_I2C lcd(0x27, 16, 2);
WiFiClient espClient;
PubSubClient client(espClient);
void setup_wifi()
{
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
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

void callback(char *topic, byte *payload, unsigned int length)
{
  String payload_str = "";
  String topic_str = String(topic);
  for (int i = 0; i < length; i++)
  {
    payload_str += (char)payload[i];
  }
  Serial.print("Message arrived [");
  Serial.print(topic_str);
  Serial.print("] ");
  Serial.println(payload_str);
  msg = payload_str;
  i = atoi(msg.c_str());
  Serial.println(i + 2);
}

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  //Use predefined PINS consts
  Serial.begin(115200);
  Wire.begin(D2, D1);
  lcd.begin();
  lcd.home();
  lcd.print("Electric: ");
  lcd.setCursor(0, 1);
  lcd.print("Water: ");
  lcd.setCursor(0, 0);
}

void loop()
{
  // put your main code here, to run repeatedly:
  if (!client.connected())
  {
    reconnect();
  }
  while (true)
  {
    lcd.setCursor(10, 0);
    lcd.print(number);
    lcd.setCursor(7, 1);
    lcd.print(number);
    delay(10000);
    number++;
    char outPayload[1000] = "";
    sprintf(outPayload, "{\"room\": \"%i\", \"elec_usage\": %i, \"water_usage\" : %i}", room, number, number);
    client.publish(outTopic, outPayload);
    client.subscribe(inTopic);
    client.loop();
  }
}
