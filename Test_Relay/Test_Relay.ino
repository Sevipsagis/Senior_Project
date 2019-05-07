#include <ESP8266WiFi.h>
#include <PubSubClient.h>

int relay = 5;
int num = 0;
int switchPin = 4;
byte button;
byte oldbutton = 0;
byte state = 0;

//  Wi-Fi
const char *ssid = "KornDva";
const char *password = "Kornasak39";
//  MQTT
const char *mqtt_server = "broker.mqttdashboard.com";
WiFiClient espClient;
PubSubClient client(espClient);
char outTopic[] = "myTopic";

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

void callback(char* topic, byte* payload, unsigned int length) {
  String text = "";
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    text += (char)payload[i];
  }
//  Serial.print(text);
//  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if (text == "ON") {
    Serial.println("ON");
    digitalWrite (relay, HIGH);
    // but actually the LED is on; this is because
    // it is active low on the ESP-01)
  } else if (text == "OFF") {
    Serial.println("OFF");
    digitalWrite (relay, LOW);
  }

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
      client.subscribe("myTopic");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds"); // Wait 5 seconds before retrying delay(1000);
    }
  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(relay, OUTPUT);
  pinMode(switchPin, INPUT);
  //Wi-Fi
  setup_wifi();
  //MQTT
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  // put your main code here, to run repeatedly:
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();
  button = digitalRead(switchPin);
  if (button && !oldbutton) // same as if(button == high && oldbutton == low)
  {
    //we have a new button press
    if (state == 0) // if the state is off, turn it on
    {
      digitalWrite (relay, HIGH);
      state = 1;
    }
    else // if the state is on, turn it off
    {
      digitalWrite (relay, LOW);
      state = 0;
    }
    oldbutton = 1;
  }
  else if (!button && oldbutton) // same as if(button == low && oldbutton == high)
  {
    // the button was released
    oldbutton = 0;
  }
}
//if (buttonState % 2 == 0) {
//  digitalWrite (relay, HIGH);
//} else if (buttonState % 2 == 1) {
//  digitalWrite (relay, LOW);
//}
//Serial.println(buttonState);
//  digitalWrite (relay, HIGH);
//  Serial.println(num);
//  num += 1;
//  delay(10000);
//  digitalWrite (relay, LOW);
//  delay(10000);
